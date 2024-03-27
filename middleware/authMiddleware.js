const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authMiddleware;
