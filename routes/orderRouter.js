const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController.js')
const  photoUpload = require('../middleware/photoUpload')
//const auth = require('../middlewares/auth.js');
router.post('/',controller.createOrder);
router.get('/',controller.getAll);
router.get('/:id',photoUpload.single("image"),controller.getOne);
router.put('/:id',controller.updateOrder);
router.delete('/:id',controller.deleteOrder);

module.exports = router;