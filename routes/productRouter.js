const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const  photoUpload = require('../middleware/photoUpload')

router.post('/',photoUpload.single("image"), productsController.addProduct);
router.get('/',photoUpload.single("image"), productsController.getAllProducts);
router.get('/:id',photoUpload.single("image"), productsController.getProductById);
router.put('/:id',photoUpload.single("image"), productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
