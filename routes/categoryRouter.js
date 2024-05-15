const express = require ('express');
const categoriesController = require('../controllers/categoriesController');
const  photoUpload = require('../middleware/photoUpload')

const router = express.Router();


//routes 
router.post('/',photoUpload.single("image"),categoriesController.createCategory);
router.get('/',photoUpload.single("image"), categoriesController.getCategories);
router.get('/:id',photoUpload.single("image"), categoriesController.getCategoryById);
router.put('/:id',photoUpload.single("image"),categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;