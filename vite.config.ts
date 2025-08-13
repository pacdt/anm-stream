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
