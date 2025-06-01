import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');


  return {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt', 'assets/*'],
        manifest: {
          name: 'Dubbii - Movies & TV Shows',
          short_name: 'Dubbii',
          description: 'Discover and watch movies and TV shows with Dubbii',
          theme_color: '#ffffff',
          icons: [
            { src: "/assets/web/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32" },
            { src: "/assets/web/icon-192.png", type: "image/png", sizes: "192x192" },
            { src: "/assets/web/icon-512.png", type: "image/png", sizes: "512x512" },
            { src: "/assets/web/icon-192-maskable.png", type: "image/png", sizes: "192x192", purpose: "maskable" },
            { src: "/assets/web/icon-512-maskable.png", type: "image/png", sizes: "512x512", purpose: "maskable" }
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        },
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

