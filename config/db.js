const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB
const DATABASE_URL = process.env.DATA_URL;
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(error => {
    console.error('Connection error:', error);
  });
