const mongoose = require('mongoose');

const CustemerSchema = new mongoose.Schema({
  name: 
  { 
    type: String, required: true 
  }
  ,
  email: {
     type: String, required: true, unique: true 
    },
  phoneNumber : {
     type: Number, required: true
     },
  country : {
     type: String, required: true 
    },
  city : {
     type: String, required: true 
    },
  zipCode  : {
     type: Number, required: true 
    },
  password  : {
     type: String, required: true
     },  
  createdAt: { 
    type: Date, default: Date.now
   },
  updatedAt: {
     type: Date, default: null
     },
});

const Custemer = mongoose.model('Custemer', CustemerSchema);

module.exports = Custemer;
