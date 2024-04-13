const Order = require('../models/order');
//i const jwt = require('jsonwebtoken');

///////////////////////////////////////////
exports.getAll = async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders);
  } catch (error) {
    res.status(400).json({ message: 'Order not found' });
  }};
///////////////////////////////////////////
exports.getOne = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: 'Order not found' });
  }};
///////////////////////////////////////////
exports.createOrder = async (req, res) => {
  try {  
  //const token = req.headers.authorization.split(' ')[1];
  //const decodedToken = jwt.verify(token, process.env.secretcode);
  //const customer_id = decodedToken._id;
  const products = req.body.products.map(product => ({
    product_id: product.product_id,
    quantity: product.quantity,
    price: product.price
}));

const order = new Order({
    customer_id: req.body.customer_id,
    products: products,
    total_price: req.body.total_price,
    status: req.body.status,
    payment_method: req.body.payment_method,
    shipping_address: {
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postal_code: req.body.postal_code,
    },
    phone: req.body.phone,
});

await order.save();
    res.status(201).json({ message: 'Order saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};
///////////////////////////////////////////
exports.updateOrder = async (req, res) => {
  try {
    //const token = req.headers.authorization.split(' ')[1];
    //const decodedToken = jwt.verify(token, process.env.secretcode);
    //const customer_id = decodedToken._id;
    const order = await Order.findOne({ _id: req.params.id });//customer_id: customer_id
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const products = req.body.products.map(product => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price: product.price
  }));
      order.products = products,
      order.total_price = req.body.total_price,
      order.status = req.body.status,
      order.payment_method = req.body.payment_method,
      order.shipping_address = {
        address_line1: req.body.address_line1,
        address_line2 : req.body.address_line2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postal_code: req.body.postal_code,
      },
      order.phone = req.body.phone,
    await order.save();
    res.status(200).json({ message: 'Order updated successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating Order' });
  }};
///////////////////////////////////////////
exports.deleteOrder = async (req, res) => {
  try{
  //const token = req.headers.authorization.split(' ')[1];
  //const decodedToken = jwt.verify(token, process.env.secretcode);
  //const customer_id = decodedToken._id;
  await Order.deleteOne({_id: req.params.id, });//customer_id: customer_id
  res.status(201).json({ message: 'Order deleted successfully!' });
  }
  catch (error) {
    res.status(400).json({ message: 'Order not found' });
  }};
