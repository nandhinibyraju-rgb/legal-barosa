import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import aiHandler from './api/ai.js'

function aiApiPlugin() {
  return {
    name: 'ai-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        if (req.method === 'POST') {
          const chunks = [];
          req.on('data', chunk => { chunks.push(chunk); });
          req.on('end', async () => {
            try {
              const bodyStr = Buffer.concat(chunks).toString('utf8');
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              req.body = {};
            }
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            try {
              await aiHandler(req, res);
            } catch (err) {
              console.error('[Vite AI Middleware Error]:', err?.message || err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Something went wrong while processing your request." }));
            }
          });
        } else if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.statusCode = 200;
          res.end();
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) {
    if (!process.env[k]) {
      process.env[k] = v;
    }
  }
  return {
    plugins: [react(), aiApiPlugin()],
  };
})

