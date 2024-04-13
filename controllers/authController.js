/////////////////////////////////////////////////////////////////////
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var storage = require("local-storage");
const mailer = require("../middleware/mailer");
const saltRounds = 10;
const register = async (req, res) => {
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
        message:
          "Successfully registered. Check your email to activate your account",
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
const login = async (req, res) => {
  const { body } = req;
  if (!body.email || !body.password)
    throw Error("Fill the all fields to login");
  const login_user = await User.findOne({ email: body.email });
  if (
    !login_user ||
    !(await bcrypt.compare(body.password, login_user.password))
  )
    throw Error("Email or password is incorect");
  if (!login_user.verification)
    throw Error("Check your email to active your account");
  if (!login_user.status) {
    console.log(login_user);
    throw Error("You can't to login");
  }
  const token = await jwt.sign({ id: login_user.id }, process.env.TOKEN_KEY);
  storage("token", token);
  res.status(200).json({
    message: "Login success",
    username: login_user.username,
    _id: login_user._id,
    email: login_user.email,
    token: storage("token"),
  });
};
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token; // Assuming token is passed in the URL params

    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }
    const verify_email = await jwt.verify(token, process.env.TOKEN_KEY);
    const verify_user = await User.findOne({ email: verify_email.email });
    if (!verify_user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (verify_user.verification == true)
      res.json({ message: "Your account is already activated." });
    const verification_email = await User.updateOne(
      { email: verify_email.email },
      { $set: { verification: true } }
    );
    if (!verification_email) throw Error("You can't to active your account");
    res.json({ message: "Your account has been activated successfully." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Failed to verify email." });
  }
};

const forgotPassword = async (req, res) => {
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
const verifyForgotPassword = async (req, res) => {
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

const logout = async (req, res) => {
  storage.clear();
  res.send(true);
};
//////////////////////////////////////////////////////////////////
module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  verifyForgotPassword,
  logout,
};
/////////////////////////////////////////////////////////////////////
