import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startStandaloneServer() {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(` [AcciAlert Backend] Running at http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Accidents API: http://localhost:${PORT}/api/accidents`);
  });

  // Handle termination signals
  const shutdown = () => {
    console.log('\n🛑 Gracefully shutting down AcciAlert backend server...');
    server.close(() => {
      console.log(' Server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startStandaloneServer();
