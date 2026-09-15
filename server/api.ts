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
