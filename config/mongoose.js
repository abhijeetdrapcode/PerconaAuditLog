require('dotenv').config();
const mongoose = require('mongoose');
const MongoURI = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

connectDB();

module.exports = mongoose;