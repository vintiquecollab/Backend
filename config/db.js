const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB
const data_base = process.env.DATABASE_URL
mongoose.connect(data_base)
    .then(()=>{
        console.log('Successfully connect');
    })
    .catch(error=>{
        console.log('Connection error', error);
    })