const express = require("express");
const app = express();
app.use(express.json());

require("./Config/db.js");
require("dotenv").config();

const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("./routes/productRouter");
const OrderRouter = require("./routes/orderRouter");
const authRoutes = require("./routes/authRouter");

const cors = require("cors");
// app.use(cors());

// Routers

app.use("/api/auth", authRoutes);

app.use("/category", categoryRouter);

app.use("/order", OrderRouter);

app.use("/product", productRouter);

// app.all("*", (req, res) => {
//   res.send("Page not found");
// });

// Error handler middleware
// app.use(errorHandler);

app.listen(process.env.PORT || 2001, () => console.log(`Server running `));

module.exports = app;
