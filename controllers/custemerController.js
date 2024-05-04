const Custemer = require('../models/Custemer');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

exports.createCustemerAdmin = asyncHandler(async (req, res) => {
  try {
    // Validation pour l'image
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    // Chemin de l'image téléchargée
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    // Télécharger l'image
    const result = await cloudinaryUploadImage(imagePath); // Supposons que cloudinaryUploadImage soit une fonction qui retourne le résultat de téléchargement de l'image

    // Créer un nouveau client avec les détails fournis
    const custemer = new Custemer({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      country: req.body.country,
      city: req.body.city,
      zipCode: req.body.zipCode,
      password: req.body.password,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    // Sauvegarder le client dans la base de données
    const savedCustemer = await custemer.save();

    // Envoyer la réponse à l'utilisateur
    res.status(201).json(savedCustemer);

    // Supprimer l'image du serveur local
    fs.unlinkSync(imagePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.createCustemers = async (req, res) => {
  const { name, email, phoneNumber, country, city, zipCode, password } = req.body;

  try {
    let existingCustemer = await Custemer.findOne({ email });

    if (existingCustemer) {
      return res.status(400).json({ message: "Custemer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustemer = new Custemer({
      name,
      email,
      phoneNumber,
      country,
      city,
      zipCode,
      password: hashedPassword,
    });

    await newCustemer.save();

    const token = jwt.sign({ custemerId: newCustemer.id},  process.env.TOKEN_KEY, { expiresIn: '1h' });

    res.status(201).json({
      token,
      custemer: {
        id: newCustemer._id,
        name: newCustemer.name,
        email: newCustemer.email,
        phoneNumber: newCustemer.phoneNumber,
        country: newCustemer.country,
        city: newCustemer.city,
        zipCode: newCustemer.zipCode,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.loginCustemers = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  try {
    const custemer = await Custemer.findOne({ email });

    if (!custemer) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, custemer.password);

    if (passwordMatch) {
      const token = jwt.sign({ custemerId: custemer.id},  process.env.TOKEN_KEY, { expiresIn: '1h' });
      res.json({ message: 'Login successful',token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.logoutCustemers = async (req, res) => {
  try {
   
    res.clearCookie('jwt');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}


exports.getAllCustemers = async (req, res) => {
  try {
    const custemer = await Custemer.find().sort({ createdAt: -1 });
    res.json(custemer);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.getProfileCustemers = async (req, res) => {
  try {
    const custemerid=req.custemerId
    const custemer = await Custemer.findById(custemerid);
    res.json(custemer);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.getCustemersById = async (req, res) => {
  try {
    const custemer = await Custemer.findById(req.params.id);
    if (!custemer) {
      res.status(404).json("Custemer not found");
    }
    res.json(custemer);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

exports.updateCustemers = async (req, res) => {
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

    const custemerUpdated = await Custemer.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!custemerUpdated) {
      return res.status(404).json("Custemer not found");
    }

    res.json(custemerUpdated);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

