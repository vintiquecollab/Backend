require("./config/db");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
// Port
const PORT = process.env.PORT || 5000;
// app.use("/users", userRoutes);
// app.use("/customers", customerRoutes);
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
// app.use("/categories", categorieRoutes);
// app.use("/brands", brandRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
