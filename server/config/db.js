const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;
  
  try {
    // Attempt connecting to the provided MONGODB_URI with a 3-second timeout
    await mongoose.connect(connUri || 'mongodb://localhost:27017/taskmanager', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB at: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed (${err.message}). Starting In-Memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Successfully connected to In-Memory MongoDB instance at: ${uri}`);
    } catch (fallbackErr) {
      console.error(`[Database Error] In-Memory MongoDB startup failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
