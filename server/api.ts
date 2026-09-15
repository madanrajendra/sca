import { Router, type Request, type Response } from 'express';
import { getPostsCollection, getClicksCollection, getSettingsCollection } from './db.js';
import { INITIAL_SEED_POSTS } from './seedData.js';

export const apiRouter = Router();

// GET /api/posts - Fetch all live promotions from MongoDB
apiRouter.get('/posts', async (_req: Request, res: Response) => {
  try {
    const postsCol = await getPostsCollection();
    const count = await postsCol.countDocuments();
    
    // Seed initial posts if empty
    if (count === 0) {
      console.log('[API] Seeding initial posts to MongoDB sca.posts...');
      await postsCol.insertMany(INITIAL_SEED_POSTS);
    }

    const posts = await postsCol.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    console.error('[API] Error fetching posts:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch posts' });
  }
});

// Helper to serve raw binary image with Vercel CDN Edge Cache
export async function servePostImage(id: string, res: Response) {
  try {
    const postsCol = await getPostsCollection();
    const post = await postsCol.findOne({ id });

    if (!post || !post.imageUrl) {
      // Fallback SVG image
      const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <rect width="1200" height="630" fill="#0b0b0b"/>
        <rect x="40" y="40" width="1120" height="550" rx="24" fill="#141414" stroke="#e50914" stroke-width="4"/>
        <text x="600" y="280" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" text-anchor="middle">SPIN CITY ALLIANCE</text>
        <text x="600" y="350" fill="#a3a3a3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" text-anchor="middle">Exclusive Alliance Member Campaign</text>
      </svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      return res.send(fallbackSvg);
    }

    const imgUrl = post.imageUrl;

    // 1. If base64 data URI: data:image/...;base64,...
    if (imgUrl.startsWith('data:image/')) {
      const commaIndex = imgUrl.indexOf(',');
      if (commaIndex !== -1) {
        const meta = imgUrl.substring(5, commaIndex);
        const mimeType = meta.split(';')[0] || 'image/png';
        const base64Data = imgUrl.substring(commaIndex + 1);
        const buffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        // Vercel Edge CDN Cache headers: cached globally on Vercel CDN for 1 year
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400');
        return res.end(buffer);
      }
    }

    // 2. If raw base64 string without data: prefix
    if (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://') && imgUrl.length > 200) {
      try {
        const buffer = Buffer.from(imgUrl, 'base64');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400');
        return res.end(buffer);
      } catch {}
    }

    // 3. If external HTTP/HTTPS URL - fetch, buffer, and serve with Vercel cache
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      try {
        const fetchRes = await fetch(imgUrl);
        if (fetchRes.ok) {
          const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
          const arrayBuf = await fetchRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuf);

          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Length', buffer.length);
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400');
          return res.end(buffer);
        }
      } catch (err) {
        console.warn(`[API] Proxy fetch failed for ${imgUrl}:`, err);
      }
      return res.redirect(302, imgUrl);
    }

    res.status(404).send('Image format not supported');
  } catch (error: any) {
    console.error('[API] Error serving image:', error);
    res.status(500).send('Failed to serve image');
  }
}

// GET /api/image/:id and /api/posts/:id/image - Cached binary image endpoint
apiRouter.get('/image/:id', async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await servePostImage(id as string, res);
});

apiRouter.get('/posts/:id/image', async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await servePostImage(id as string, res);
});

// GET /api/posts/:id - Fetch single post
apiRouter.get('/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const postsCol = await getPostsCollection();
    const post = await postsCol.findOne({ id });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, post });
  } catch (error: any) {
    console.error('[API] Error fetching post:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch post' });
  }
});

// POST /api/posts - Create a new post live with string/base64 image
apiRouter.post('/posts', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.title || !body.imageUrl) {
      return res.status(400).json({ success: false, error: 'Title and image are required.' });
    }

    const postsCol = await getPostsCollection();
    const newId = body.id || `promo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newPost = {
      id: newId,
      businessId: body.businessId || 'biz_apex',
      businessName: body.businessName || 'Spin City Alliance Member',
      businessLogo: body.businessLogo || 'https://static.wixstatic.com/media/fd8c12_f8c0c711939348c6adc89cb082e8d0e5~mv2.jpg/v1/fit/w_2500,h_1330,al_c/fd8c12_f8c0c711939348c6adc89cb082e8d0e5~mv2.jpg',
      allianceId: body.allianceId || 'all_blr',
      title: body.title,
      shortDescription: body.shortDescription || (body.description ? body.description.substring(0, 90) + '...' : ''),
      description: body.description || '',
      categoryName: body.categoryName || 'Alliance Promotion',
      // Base64 string or URL stored directly in MongoDB
      imageUrl: body.imageUrl,
      offer: body.offer || 'Special Alliance Member Offer',
      targetAudience: body.targetAudience || 'Local Community & Businesses',
      location: body.location || 'Local Metro Area',
      startDate: body.startDate || new Date().toISOString().substring(0, 10),
      endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      cta: body.cta || 'Claim Offer',
      destinationUrl: body.destinationUrl || 'https://spincityalliance.com',
      shareHeadline: body.shareHeadline || body.title,
      shareMessage: body.shareMessage || body.description,
      status: body.status || 'LIVE',
      estimatedReach: Number(body.estimatedReach) || 15000,
      views: 1,
      clicks: 0,
      shares: 0,
      leadsCount: 0,
      referralsCount: 0,
      reportedSalesCount: 0,
      estimatedRevenue: 0,
      membersPromotingCount: 0,
      channelContent: body.channelContent || {},
      availableChannels: body.availableChannels || ['Social Media', 'Alliance Network', 'Direct Link'],
      createdAt: new Date().toISOString(),
    };

    await postsCol.insertOne(newPost);
    console.log(`[API] Created new post "${newPost.title}" (ID: ${newId}) in MongoDB sca.posts`);

    res.status(201).json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('[API] Error creating post:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create post' });
  }
});

// POST /api/posts/:id/click - Increment click count and log click
apiRouter.post('/posts/:id/click', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const postsCol = await getPostsCollection();
    const clicksCol = await getClicksCollection();

    // Increment click count in posts
    const result = await postsCol.findOneAndUpdate(
      { id },
      { $inc: { clicks: 1 } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Register click event
    const clickLog = {
      postId: id,
      timestamp: new Date(),
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      referrer: req.headers['referer'] || 'direct',
    };
    await clicksCol.insertOne(clickLog);

    console.log(`[API] Registered click for post ${id}. Total clicks: ${result.clicks}`);
    res.json({ success: true, clicks: result.clicks, post: result });
  } catch (error: any) {
    console.error('[API] Error registering click:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to register click' });
  }
});

// DELETE /api/posts/:id - Delete a post from MongoDB sca.posts
apiRouter.delete('/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const postsCol = await getPostsCollection();
    const clicksCol = await getClicksCollection();

    const result = await postsCol.deleteOne({ id });
    await clicksCol.deleteMany({ postId: id });

    console.log(`[API] Deleted post ${id} from MongoDB sca.posts`);
    res.json({ success: true, id, deletedCount: result.deletedCount });
  } catch (error: any) {
    console.error('[API] Error deleting post:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to delete post' });
  }
});

// GET /api/settings/:businessId - Fetch business settings
apiRouter.get('/settings/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const settingsCol = await getSettingsCollection();
    const settings = await settingsCol.findOne({ businessId });

    if (!settings) {
      // Default initial numbers
      return res.json({
        success: true,
        settings: {
          businessId,
          instagramFollowers: 12500,
          facebookFollowers: 8200,
          miscellaneousFollowers: 4300,
          estimatedReach: 25000,
          updatedAt: new Date(),
        },
      });
    }

    res.json({ success: true, settings });
  } catch (error: any) {
    console.error('[API] Error fetching settings:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch settings' });
  }
});

// POST /api/settings - Update social followers and estimated reach
apiRouter.post('/settings', async (req: Request, res: Response) => {
  try {
    const {
      businessId = 'biz_apex',
      instagramFollowers = 0,
      facebookFollowers = 0,
      miscellaneousFollowers = 0,
      estimatedReach,
    } = req.body;

    const ig = Math.max(0, Number(instagramFollowers) || 0);
    const fb = Math.max(0, Number(facebookFollowers) || 0);
    const misc = Math.max(0, Number(miscellaneousFollowers) || 0);
    const calculatedReach = estimatedReach !== undefined ? Number(estimatedReach) : (ig + fb + misc);

    const settingsCol = await getSettingsCollection();
    const updatedData = {
      businessId,
      instagramFollowers: ig,
      facebookFollowers: fb,
      miscellaneousFollowers: misc,
      estimatedReach: calculatedReach,
      updatedAt: new Date(),
    };

    await settingsCol.updateOne(
      { businessId },
      { $set: updatedData },
      { upsert: true }
    );

    console.log(`[API] Saved settings for ${businessId}: IG=${ig}, FB=${fb}, Misc=${misc} => Reach=${calculatedReach}`);
    res.json({ success: true, settings: updatedData });
  } catch (error: any) {
    console.error('[API] Error saving settings:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to save settings' });
  }
});
