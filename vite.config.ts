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
            // Headers baseados na análise do DevTools para simular acesso mobile
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
            proxyReq.setHeader('Accept', '*/*');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br, zstd');
            proxyReq.setHeader('Accept-Language', 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6,pt-PT;q=0.5,it;q=0.4');
            proxyReq.setHeader('Origin', 'https://youtube.googleapis.com');
            proxyReq.setHeader('Referer', 'https://youtube.googleapis.com/embed/?autohide=1&enablecastapi=0&html5=1&ps=blogger&enablejsapi=1&origin=https%3A%2F%2Fwww.blogger.com');
            proxyReq.setHeader('Sec-Fetch-Dest', 'empty');
            proxyReq.setHeader('Sec-Fetch-Mode', 'cors');
            proxyReq.setHeader('Sec-Fetch-Site', 'same-origin');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Pragma', 'no-cache');
            if (req.headers.range) {
              proxyReq.setHeader('Range', req.headers.range);
            }
            console.log('🎬 [BLOGGER PROXY] Sending video request with mobile headers:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adicionar headers CORS para permitir acesso do frontend
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Range, Content-Type, Accept';
            proxyRes.headers['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range, Accept-Ranges';
            
            // Forçar Content-Type correto para vídeos
            if (req.url && req.url.includes('video.g')) {
              proxyRes.headers['Content-Type'] = 'video/mp4';
              proxyRes.headers['Accept-Ranges'] = 'bytes';
            }
            
            // Remover headers que podem causar problemas
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            console.log('🎬 [BLOGGER PROXY] Received video response:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy específico para animefire.plus
      '/api/animefire': {
        target: 'https://animefire.plus',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/animefire/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('AnimeFire proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Headers necessários para contornar restrições do animefire.plus
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            proxyReq.setHeader('Referer', 'https://animefire.plus/');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Accept-Language', 'pt-BR,pt;q=0.9,en;q=0.8');
            console.log('🔥 [ANIMEFIRE PROXY] Sending request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adicionar headers CORS
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept';
            console.log('🔥 [ANIMEFIRE PROXY] Received response:', proxyRes.statusCode, req.url);
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
