const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: "pending",
  },
  payment_method: {
    type: String,
    required: true,
  },
  shipping_address: {
    type: {
      address_line1: String,
      address_line2: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
