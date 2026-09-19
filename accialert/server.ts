import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend/src/app.js';
import { connectDB } from './backend/src/config/db.js';

const projectRoot = process.cwd();
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  // Initialize Database connection (non-blocking / resilient)
  await connectDB();

  // In development, mount Vite middleware for instant HMR and SPA serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production, serve compiled static files from dist/
    const distPath = path.join(projectRoot, 'dist');
    const express = (await import('express')).default;
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log(`🚀 AcciAlert is running -> open  http://localhost:${PORT}  in your browser`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Accidents API: http://localhost:${PORT}/api/accidents`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use (another app or an old AcciAlert is still running).`);
      console.error('   Fix 1: stop the other terminal (Ctrl + C), or close other Node apps.');
      console.error('   Fix 2 (PowerShell):  $env:PORT=3001; npm run dev');
      console.error('   Fix 2 (CMD):         set PORT=3001 && npm run dev');
    } else {
      console.error('❌ Server error:', err);
    }
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
