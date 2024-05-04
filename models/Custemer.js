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
     image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    }, 

  isDeleted: {
    type: Boolean, default: true 
   },
    isActive: 
    { type: Boolean, default: true 
   },
  
}
,
{
   timestamps : true
});

const Custemer = mongoose.model('Custemer', CustemerSchema);

module.exports = Custemer;