const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// This is connecting with async await
const connectDB = async () => {
  try {
    // If returns a promise.. Put await
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure = 1
    process.exit(1);
  }
};

module.exports = connectDB;
