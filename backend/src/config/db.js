import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '  [MongoDB Warning] MONGODB_URI environment variable is not defined. Running in transient in-memory storage fallback mode until MONGODB_URI is provided.'
    );
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(` [MongoDB Connected] Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(' [MongoDB Connection Error]:', error.message);
    console.warn('  Continuing server execution with fallback storage.');
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('  [MongoDB Disconnected]');
});

mongoose.connection.on('error', (err) => {
  console.error(' [MongoDB Runtime Error]:', err.message);
});

export const getDbStatus = () => {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
  };
};
