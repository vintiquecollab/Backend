const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const { cloudinaryUploadImage } = require("../utils/cloudinary");
// Create: Ajouter un nouveau produit
const addProduct = asyncHandler(async (req, res) => {
    try {
        const {
            category_id,
            title,
            description,
            price,
            size,
            color,
            quantity,
        } = req.body;

        // Validation pour l'image
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image fournie" });
        }

        // Chemin de l'image téléchargée
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

        // Télécharger l'image
        const result = await cloudinaryUploadImage(imagePath); // Supposons que cloudinaryUploadImage soit une fonction qui retourne le résultat de téléchargement de l'image

        // Créer un nouveau produit avec les détails fournis
        const newProduct = new Product({
            category_id,
            title,
            description,
            price,
            size,
            color,
            quantity,
            media: {
                url: result.secure_url,
                publicId: result.public_id,
            },
        });

        // Sauvegarder le produit dans la base de données
        const savedProduct = await newProduct.save();

        // Envoyer la réponse à l'utilisateur
        res.status(201).json(savedProduct);

        // Supprimer l'image du serveur local
        fs.unlinkSync(imagePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read: Obtenir tous les produits
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read: Obtenir un produit par son ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update: Mettre à jour un produit par son ID
const updateProduct = async (req, res) => {
    try {
        req.body.updatedAt = new Date();
        let updatedData = req.body;

        // Vérifiez si une nouvelle image est fournie
        if (req.file) {
            // Chemin de l'image téléchargée
            const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

            // Télécharger la nouvelle image sur Cloudinary
            const result = await cloudinaryUploadImage(imagePath);

            // Mettre à jour les données de l'image dans l'objet à mettre à jour
            updatedData.image = {
                url: result.secure_url,
                publicId: result.public_id,
            };

            // Supprimer l'image du serveur local
            fs.unlinkSync(imagePath);
        }

        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// Delete: Supprimer un produit par son ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const mongoose = require('mongoose');

const getProductsByCategory = asyncHandler(async (req, res) => {
    try {
        const { category } = req.params;
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const products = await Product.find({ category_id: category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory
};
