const express = require("express");
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');

<<<<<<< HEAD

require("./config/db");
=======
require("./Config/db.js");
>>>>>>> d66996176cc3935ebd5d6d027ecabd63ac67bcc3
require("dotenv").config();

const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("./routes/productRouter");
const OrderRouter = require("./routes/orderRouter");
const authRoutes = require("./routes/authRouter");
const custemerRoutes = require("./routes/custemerRoutes");

const cors = require("cors");
app.use(cors());

// Routers
app.use("/api/auth", authRoutes);

app.use("/custemer", custemerRoutes);

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
