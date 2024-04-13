const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController.js')
//const auth = require('../middlewares/auth.js');

router.get('/',controller.getAll);
router.get('/:id',controller.getOne);
router.post('/',controller.createOrder);
router.put('/:id',controller.updateOrder);
router.delete('/:id',controller.deleteOrder);

module.exports = router;