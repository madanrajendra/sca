import { createServerApp } from '../server/app.js';
import { connectToDatabase } from '../server/db.js';

let isConnected = false;
const app = createServerApp();

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectToDatabase();
      isConnected = true;
    } catch (err) {
      console.error('[Vite/Vercel Serverless] MongoDB Connection Error:', err);
    }
  }
  return app(req, res);
}
