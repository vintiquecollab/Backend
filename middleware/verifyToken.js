const jwt = require("jsonwebtoken");
const jwtSecretKey = "your_secret_key";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, jwtSecretKey);

    req.decodedToken = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
