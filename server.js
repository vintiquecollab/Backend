require("./config/db");
const express = require("express");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const custemerRoutes = require("./routes/custemerRoutes");
const app = express();
app.use(express.json());
app.use(cookieParser());

// Port
const PORT = process.env.PORT || 5000;
 
 app.use("/custemers", custemerRoutes);
 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
