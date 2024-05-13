const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  media: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  }, 
  status: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
