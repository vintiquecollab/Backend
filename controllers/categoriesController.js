const Category = require("../models/category");
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");


const createCategory = asyncHandler(async (req, res) => {
  try {
    const find = await Category.findOne({ name: req.body.name });
    if (find) {
      return res.status(400).json({ error: "This category already exists" });
    } else {
      // Validation pour l'image
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Chemin de l'image téléchargée
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

      // Télécharger l'image
      const result = await cloudinaryUploadImage(imagePath);

      // Créer une nouvelle catégorie avec les détails fournis
      const newCategory = await Category.create({
        name: req.body.name,
        media: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });

      // Supprimer l'image du serveur local
      fs.unlinkSync(imagePath);

      return res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateCategory = asyncHandler(async (req, res) => {
  try {
    // Vérifiez si une nouvelle image est fournie
    if (req.file) {
      // Chemin de l'image téléchargée
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

      // Télécharger la nouvelle image sur Cloudinary
      const result = await cloudinaryUploadImage(imagePath);

      // Mettre à jour les données de l'image dans l'objet à mettre à jour
      req.body.media = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      // Supprimer l'image du serveur local
      fs.unlinkSync(imagePath);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
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
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};
