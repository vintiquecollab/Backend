const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const photoUpload = require("../middleware/photoUpload");

// Define route for fetching products by category ID
router.get("/category/:categoryId", productsController.getProductsByCategory);

// Define other routes
router.post("/", photoUpload.single("image"), productsController.addProduct);
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.put(
  "/:id",
  photoUpload.single("image"),
  productsController.updateProduct
);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
