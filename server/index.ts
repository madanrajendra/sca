import dotenv from 'dotenv';
import { createServerApp } from './app.js';
import { connectToDatabase } from './db.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await connectToDatabase();
    const app = createServerApp();

    app.listen(PORT, () => {
      console.log(`[Server] Live backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

start();
