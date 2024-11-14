const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/product.route");
const authRoutes = require("./routes/auth.route");
const Product = require("./models/Product");

const app = express();
const port = 3001;

connectDB();

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`example app listening to ${port}`);
});
