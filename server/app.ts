import express from 'express';
import cors from 'cors';
import { apiRouter } from './api.js';
import { handleShareRoute } from './shareHandler.js';

export function createServerApp() {
  const app = express();

  // Allow cross-origin requests
  app.use(cors());

  // Support large base64 image strings in JSON
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API router
  app.use('/api', apiRouter);

  // Sharable link route
  app.get('/share/:id', handleShareRoute);

  // Direct image route
  app.get('/image/:id', async (req, res) => {
    const { servePostImage } = await import('./api.js');
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await servePostImage(id as string, res);
  });

  return app;
}
