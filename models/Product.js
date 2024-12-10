const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  featured: Boolean,
  latest: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
