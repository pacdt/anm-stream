import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    // Configuração para servir arquivos JSON estáticos
    fs: {
      allow: ['..', './src/static-api']
    },
    // Proxy para contornar CORS com APIs externas
    proxy: {
      '/api/external': {
        target: 'https://animefire.plus',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/external/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy específico para vídeos do lightspeedst.net
      '/api/video': {
        target: 'https://lightspeedst.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/video/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Video proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adicionar headers necessários para contornar restrições
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            proxyReq.setHeader('Referer', 'https://animefire.plus/');
            proxyReq.setHeader('Accept', 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5');
            proxyReq.setHeader('Accept-Encoding', 'identity;q=1, *;q=0');
            proxyReq.setHeader('Range', req.headers.range || 'bytes=0-');
            console.log('🎬 [VIDEO PROXY] Sending video request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adicionar headers CORS para permitir acesso do frontend
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Range';
            console.log('🎬 [VIDEO PROXY] Received video response:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy específico para vídeos do blogger.com
      '/api/blogger': {
        target: 'https://www.blogger.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/blogger/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Blogger proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adicionar headers necessários para contornar restrições do Blogger
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Referer', 'https://www.blogger.com/');
            proxyReq.setHeader('Origin', 'https://www.blogger.com');
            proxyReq.setHeader('Accept', 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5');
            proxyReq.setHeader('Accept-Encoding', 'identity;q=1, *;q=0');
            proxyReq.setHeader('Accept-Language', 'pt-BR,pt;q=0.9,en;q=0.8');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Pragma', 'no-cache');
            if (req.headers.range) {
              proxyReq.setHeader('Range', req.headers.range);
            }
            console.log('🎬 [BLOGGER PROXY] Sending video request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adicionar headers CORS para permitir acesso do frontend
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Range, Content-Type, Accept';
            proxyRes.headers['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range, Accept-Ranges';
            // Remover headers que podem causar problemas
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            console.log('🎬 [BLOGGER PROXY] Received video response:', proxyRes.statusCode, req.url);
          });
        },
      },
    }
  },
  // Incluir arquivos JSON como assets
  assetsInclude: ['**/*.json'],
  publicDir: 'public',
  // Garantir que arquivos JSON sejam tratados como assets e copiados corretamente
  build: {
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (assetInfo) => {
          // Manter arquivos JSON da API na estrutura original
          if (assetInfo.name && assetInfo.name.endsWith('.json') && assetInfo.name.includes('api/')) {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // Garantir que a pasta public/api seja copiada corretamente
    copyPublicDir: true
  }
})
