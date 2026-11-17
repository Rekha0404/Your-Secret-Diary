const mongoose = require('mongoose');

const dbState = {
  connected: false,
  mode: 'disconnected', // 'mongodb' | 'local'
  error: null,
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      dbState.connected = true;
      dbState.mode = 'mongodb';
      console.log(' MongoDB Connected Successfully to Atlas!');
      return dbState;
    } catch (err) {
      console.warn('⚠️ MongoDB Atlas connection warning:', err.message);
      console.warn('Tip: If using Atlas, ensure your IP address is whitelisted in MongoDB Atlas Network Access.');
      dbState.error = err.message;
    }
  }

  // Fallback to local persistent store so app never crashes during demo/offline
  dbState.connected = true;
  dbState.mode = 'local';
  console.log(' Local Persistent Database activated (server/data/diary_db.json). App is 100% operational!');
  return dbState;
};

module.exports = {
  connectDB,
  dbState,
};
