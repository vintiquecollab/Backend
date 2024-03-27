const mongoose = require("mongoose");
const users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "your_secret_key";

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- signupController---------------
const signupController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, jwtSecretKey, {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// ------------------------getUsersController------------------

const getUsersController = async (req, res) => {
  try {
    const user = await users.find({});
    // console.log(req.cookies.user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const getUsersByIdController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

// const deleteUserController = async (req, res) => {
//   const id = req.params.id;

//   try {
//     await users.deleteOne({ _id: id });

//     res.status(201).send("User Deleted!!!!");
//   } catch (err) {
//     res.status(500).send("Error: " + err);
//   }
// };
const updateUserController = async (req, res) => {
  try {
    const user = await users.updateOne({ _id: req.params.id }, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

module.exports = {
  getUsersController,
  getUsersByIdController,
  loginController,
  signupController,

  //   deleteUserController,
  updateUserController,
};
