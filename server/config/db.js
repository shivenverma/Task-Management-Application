const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (process.env.DATABASE_URL) {
    console.log('[Database] Operating with Neon PostgreSQL via Prisma (DATABASE_URL configured).');
    return;
  }

  // Return early if already connected (reuse connection in serverless warm starts)
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('[Database] Reusing existing MongoDB connection.');
    return;
  }

  const connUri = process.env.MONGODB_URI;

  if (connUri) {
    try {
      await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 10000,
      });
      isConnected = true;
      console.log(`[Database] Connected to MongoDB Atlas at: ${mongoose.connection.host}`);
    } catch (err) {
      console.error(`[Database] Failed to connect to MongoDB: ${err.message}`);
      throw err;
    }
  } else {
    try {
      await mongoose.connect('mongodb://localhost:27017/taskmanager', {
        serverSelectionTimeoutMS: 3000,
      });
      isConnected = true;
      console.log(`[Database] Connected to local MongoDB.`);
    } catch (err) {
      console.warn(`[Database] Local MongoDB failed. Starting In-Memory fallback...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        isConnected = true;
        console.log(`[Database] Connected to In-Memory MongoDB at: ${uri}`);
      } catch (fallbackErr) {
        console.error(`[Database Error] In-Memory MongoDB startup failed: ${fallbackErr.message}`);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
