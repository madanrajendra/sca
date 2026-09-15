import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createServerApp } from './server/app.js';
import { connectToDatabase } from './server/db.js';

function expressPlugin(): Plugin {
  return {
    name: 'express-backend',
    configureServer: async (server) => {
      try {
        await connectToDatabase();
        const app = createServerApp();
        server.middlewares.use(app);
        console.log('[Vite] Express MongoDB backend middleware attached.');
      } catch (err) {
        console.error('[Vite] Failed to initialize backend middleware:', err);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), expressPlugin()],
});
