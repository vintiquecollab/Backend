const express = require ('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoriesController');

const router = express.Router();

//routes 
router.post('/', createCategory);
router.get('/', getCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;