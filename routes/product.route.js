const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth.middleware");
const {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
  getProductsById,
} = require("../controllers/product.controller");
router.get("/", getProducts);
router.post("/", checkAuth("Admin"), addProducts);
router.patch("/:id", checkAuth("Admin"), updateProducts);
router.delete("/:id", checkAuth("Super Admin"), deleteProducts);
router.get("/:id", getProductsById);

module.exports = router;
