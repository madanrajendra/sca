import type { Request, Response } from 'express';
import { getPostsCollection, getClicksCollection } from './db.js';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function handleShareRoute(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const postsCol = await getPostsCollection();
    const clicksCol = await getClicksCollection();

    // 1. Fetch the post
    const post = await postsCol.findOne({ id });

    if (!post) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Promotion Not Found | Spin City Alliance</title>
          <style>
            body { background: #050505; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: #0b0b0b; border: 1px solid #262626; padding: 40px; border-radius: 16px; max-width: 440px; }
            h1 { font-size: 24px; color: #e50914; margin-bottom: 12px; }
            p { color: #a3a3a3; font-size: 14px; margin-bottom: 24px; }
            a { background: #e50914; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Promotion Not Found</h1>
            <p>The shared campaign link you followed is expired or unavailable.</p>
            <a href="/">Go to Home</a>
          </div>
        </body>
        </html>
      `);
    }

    // 2. Increment click count and log click in MongoDB
    const updatedPost = await postsCol.findOneAndUpdate(
      { id },
      { $inc: { clicks: 1 } },
      { returnDocument: 'after' }
    );
    const totalClicks = updatedPost?.clicks || (post.clicks + 1);

    const clickLog = {
      postId: id,
      timestamp: new Date(),
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      referrer: req.headers['referer'] || 'direct',
    };
    await clicksCol.insertOne(clickLog);
    console.log(`[Share] Link opened for "${post.title}" (${id}). Registered click #${totalClicks}`);

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5173';
    const fullUrl = `${protocol}://${host}/share/${id}`;
    const destinationUrl = post.destinationUrl || '/';

    const safeTitle = escapeHtml(post.title);
    const safeDesc = escapeHtml(post.shortDescription || post.description || post.offer || 'Exclusive promotion on Spin City Alliance');
    const safeBizName = escapeHtml(post.businessName || 'Alliance Member');
    const safeCategory = escapeHtml(post.categoryName || 'Promotion');
    const safeOffer = escapeHtml(post.offer || '');

    // 3. Return HTML with Open Graph & Twitter Card meta tags and high-converting landing page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} | ${safeBizName} on Spin City Alliance</title>

  <!-- Open Graph / URL Context Preview Meta Tags -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Spin City Alliance">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${post.imageUrl}">
  <meta property="og:image:alt" content="${safeTitle}">
  <meta property="og:url" content="${fullUrl}">

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@SpinCityAlliance">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${post.imageUrl}">

  <style>
    :root {
      --bg: #050505;
      --card-bg: #0b0b0b;
      --border: #1f1f1f;
      --accent: #e50914;
      --accent-hover: #b80710;
      --text-main: #f5f5f5;
      --text-sub: #a3a3a3;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 48px;
    }
    .header {
      width: 100%;
      max-width: 680px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .logo-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: #fff;
      font-weight: 900;
      font-size: 14px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .logo-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 12px var(--accent);
    }
    .tag {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      background: rgba(229, 9, 20, 0.15);
      color: #ff6b70;
      border: 1px solid rgba(229, 9, 20, 0.3);
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .main-card {
      width: 100%;
      max-width: 680px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .image-container {
      width: 100%;
      max-height: 380px;
      overflow: hidden;
      position: relative;
      background: #000;
    }
    .banner-img {
      width: 100%;
      height: auto;
      max-height: 380px;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .content-area {
      padding: 28px;
    }
    .biz-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }
    .biz-logo {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      object-fit: cover;
      border: 1px solid var(--border);
    }
    .biz-name {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
    }
    .biz-meta {
      font-size: 11px;
      color: var(--text-sub);
      margin-top: 2px;
    }
    h1 {
      font-size: 24px;
      font-weight: 900;
      line-height: 1.3;
      margin-bottom: 14px;
      color: #fff;
    }
    .description {
      font-size: 14px;
      line-height: 1.6;
      color: #d4d4d4;
      margin-bottom: 24px;
    }
    .offer-box {
      background: rgba(229, 9, 20, 0.08);
      border: 1px solid rgba(229, 9, 20, 0.35);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .offer-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #ff6b70;
      letter-spacing: 0.5px;
    }
    .offer-text {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      margin-top: 2px;
    }
    .metrics-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 14px 20px;
      background: #060606;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-bottom: 24px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-sub);
    }
    .metric-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .metric-val {
      color: #fff;
      font-weight: 900;
    }
    .cta-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .primary-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      font-weight: 800;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 24px;
      border-radius: 12px;
      transition: all 0.2s ease;
      box-shadow: 0 8px 24px rgba(229, 9, 20, 0.35);
      border: none;
      cursor: pointer;
    }
    .primary-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }
    .share-row {
      display: flex;
      gap: 10px;
      margin-top: 8px;
    }
    .secondary-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #141414;
      border: 1px solid var(--border);
      color: #d4d4d4;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .secondary-btn:hover {
      background: #222;
      color: #fff;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      background: #10b981;
      color: #fff;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 800;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="header">
    <a href="/" class="logo-badge">
      <span class="logo-dot"></span>
      <span>Spin City Alliance</span>
    </a>
    <span class="tag">Active Promotion</span>
  </div>

  <div class="main-card">
    <div class="image-container">
      <img src="${post.imageUrl}" alt="${safeTitle}" class="banner-img">
    </div>

    <div class="content-area">
      <div class="biz-row">
        <img src="${post.businessLogo || 'https://static.wixstatic.com/media/fd8c12_f8c0c711939348c6adc89cb082e8d0e5~mv2.jpg/v1/fit/w_2500,h_1330,al_c/fd8c12_f8c0c711939348c6adc89cb082e8d0e5~mv2.jpg'}" alt="${safeBizName}" class="biz-logo">
        <div>
          <div class="biz-name">${safeBizName}</div>
          <div class="biz-meta">${safeCategory} • Verified Alliance Partner</div>
        </div>
      </div>

      <h1>${safeTitle}</h1>
      <p class="description">${safeDesc}</p>

      ${safeOffer ? `
      <div class="offer-box">
        <div>
          <div class="offer-label">Special Alliance Offer</div>
          <div class="offer-text">${safeOffer}</div>
        </div>
        <span style="font-size:24px;">🎁</span>
      </div>` : ''}

      <div class="cta-row">
        <a href="${destinationUrl}" target="_blank" rel="noopener noreferrer" class="primary-btn">
          ${escapeHtml(post.cta || 'Claim Offer & Visit Website')} ➔
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error: any) {
    console.error('[Share] Error rendering share page:', error);
    res.status(500).send('Error rendering promotion');
  }
}
