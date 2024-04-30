const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB
<<<<<<< HEAD
const DATABASE_URL = process.env.DATA_URL;
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(error => {
    console.error('Connection error:', error);
=======
const data_base = process.env.DATA_URL;
mongoose
  .connect(data_base)
  .then(() => {
    console.log("Successfully connect");
  })
  .catch((error) => {
    console.log("Connection error", error);
>>>>>>> d66996176cc3935ebd5d6d027ecabd63ac67bcc3
  });
