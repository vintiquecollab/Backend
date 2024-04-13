const Category = require("../models/category");

const createCategory = async (req, res) => {
  try {
    // console.log('ggggggggggggggggggggggg')
    // const newCategory = req.body
    const find = await Category.findOne({ name: req.body.name });
    if (find) {
      res.status(201).json({ message: "this category already exists" });
    } else {
      const newCategory = await Category.create({
        name: req.body.name,
        media: req.body.media,
      });
      res.send(newCategory);
      res.status(201).json({ message: "Category created successfully" });
    }
    res.send('jjjjjjjjjjjjjjjjjjjjjjjjj')
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      { name: req.body.name },
      // { new: true },
      { media: req.body.media}
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
  const id = req.params.id
  try {
    const findCategory = await Category.findById(id);
    console.log(findCategory);
    if(!findCategory) res.status(400).json({message: 'Category not exist'})
    if(findCategory.status) await Category.findByIdAndUpdate(id, {status: false})
    if(findCategory.status) res.json({ message: "Category deleted successufully" });
    if(!findCategory.status) await Category.findByIdAndUpdate(id, {status: true})
    if(!findCategory.status) res.json({ message: "Category reset successufully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

