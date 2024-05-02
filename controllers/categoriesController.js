const Category = require("../models/category");

const createCategory = async (req, res) => {
  try {
    const find = await Category.findOne({ name: req.body.name });
    if (find) {
      return res.status(400).json({ error: "This category already exists" });
    } else {
      const newCategory = await Category.create({
        name: req.body.name,
        media: req.body.media,
      });
      return res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name }
      // { new: true },
      // { media: req.body.media }
    );
    return res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const deleteCategory = async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ message: "Category deleted successufully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const findCategory = await Category.findById(id);
    if (!findCategory)
      return res.status(400).json({ message: "Category not exist" });

    if (findCategory.status) {
      await Category.findByIdAndUpdate(id, { status: false });
      return res.json({ message: "Category deleted successfully" });
    } else {
      await Category.findByIdAndUpdate(id, { status: true });
      return res.json({ message: "Category reset successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
