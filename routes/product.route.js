const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").at(-1);
    cb(null, uniqueSuffix + "." + extension);
  },
});
const upload = multer({ storage: storage });
const { checkAuth } = require("../middleware/auth.middleware");
const {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
  getProductsById,
  createOrder,
} = require("../controllers/product.controller");
router.get("/", getProducts);
router.post("/", checkAuth("Admin"), upload.single("image"), addProducts);
router.patch("/:id", checkAuth("Admin"), updateProducts);
router.delete("/:id", checkAuth("Super Admin"), deleteProducts);
router.get("/:id", getProductsById);
router.post("/order", checkAuth(), createOrder);

module.exports = router;
