import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      server: {
        port: 5173,
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
          },
          // Roo: Add proxy for Google Cloud Storage to prevent CORS issues
          '/gcs': {
            target: 'https://storage.googleapis.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/gcs/, ''),
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(new URL('.', import.meta.url).pathname, '.'),
        }
      }
    };
});
