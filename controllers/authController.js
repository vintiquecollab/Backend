const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var storage = require("local-storage");
const mailer = require("../middleware/mailer");
const saltRounds = 10;
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

exports.createAdmin = asyncHandler(async (req, res) => {
  try {
    // Validation pour l'image
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    // Chemin de l'image téléchargée
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    // Télécharger l'image
    const result = await cloudinaryUploadImage(imagePath); // Supposons que cloudinaryUploadImage soit une fonction qui retourne le résultat de téléchargement de l'image

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Créer un nouvel administrateur avec les détails fournis
    const admin = new User({
      email: req.body.email,
      password: hashedPassword,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      role: req.body.role || 'admin', // par défaut, l'administrateur a le rôle 'admin'
      verification: req.body.verification || false, // par défaut, la vérification est fausse
      status: req.body.status || false, // par défaut, le statut est faux
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    // Sauvegarder l'administrateur dans la base de données
    const savedAdmin = await admin.save();

    // Envoyer la réponse à l'utilisateur
    res.status(201).json(savedAdmin);

    // Supprimer l'image du serveur local
    fs.unlinkSync(imagePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;
  try {
    if (!first_name || !last_name || !email || !password || !confirm_password) {
      throw Error("Fill in all fields to register");
    }
    if (password !== confirm_password) {
      throw Error("Passwords do not match");
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ massage: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // Create the user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashPassword,
    });
    if (user) {
      mailer.main("register", user);
      res.json({
        message: "Successfully registered.",
        email: email,
      });
    } else {
      throw Error("User not created, please try again");
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Registration failed");
  }
};

exports.login = async (req, res) => {
  const { body } = req;
  if (!body.email || !body.password)
    throw Error("Fill the all fields to login");
  const login_user = await User.findOne({ email: body.email });
  console.log(login_user);
  if (
    !login_user ||
    !(await bcrypt.compare(body.password, login_user.password))
  ) return res.status(400).json({message:"Email or password is incorrect"}) 

  const token = await jwt.sign({ id: login_user.id }, process.env.TOKEN_KEY);
  res.status(200).json({ token });
};

exports.getLoggedInUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getLoggedInUserInfo:', error);
    res.status(500).json({ error: 'Server Error' });
  }
}



exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    if (!email) res.status(400).json({ message: "Enter your email" });
    const forget_password_email = await User.findOne({ email: email });
    if (!forget_password_email)
      res.status(400).json({ message: "User not found" });

    mailer.main("forgotPassword", forget_password_email);
    res.json({ message: "Check your email" });
  } catch {
    res.status(500).json({ message: "Failed ." });
  }
};

exports.verifyForgotPassword = async (req, res) => {
  const token = req.params.token;
  const verify_token = await jwt.verify(token, process.env.TOKEN_KEY);
  const verify_token_email = await User.findOne({ email: verify_token.email });
  const new_token = await jwt.sign(
    { id: verify_token_email._id },
    process.env.TOKEN_KEY
  );
  storage("new_token", new_token);
  res.status(201).json({message: 'go to form foget password'})
};

exports.logout = async (req, res) => {
  storage.clear();
  res.send(true);
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    let updatedData = req.body;

    // Check if a new image is provided
    if (req.file) {
      // Path of the uploaded image
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

      // Upload the new image to Cloudinary
      const result = await cloudinaryUploadImage(imagePath);

      // Update the image data in the object to be updated
      updatedData.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      // Remove the image from the local server
      fs.unlinkSync(imagePath);
    }

    const userUpdated = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!userUpdated) {
      return res.status(404).json("User not found");
    }

    res.json(userUpdated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};