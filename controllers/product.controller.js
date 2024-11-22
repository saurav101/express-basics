const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const getProducts = async (req, res) => {
  const { limit, page, search } = req.query;
  const filter = {};
  const sort = {};
  if (req.query.priceOrder) {
    sort.price = req.query.priceOrder;
  }

  if (req.query.minPrice && req.query.maxPrice) {
    filter.price = {
      $lte: req.query.minPrice,
      $gte: req.query.maxPrice,
    };
  }
  try {
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .find({ name: search });
    const total = await Product.countDocuments(filter); // Count total products
    res.json({
      total,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};
// const addProducts = async (req, res) => {
//   console.log(req.headers.token);
//   try {
//     var decoded = jwt.verify(req.headers.token, "secret");
//     console.log(decoded);
//     await Product.create(req.body);
//     res.json({
//       message: "product added successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(401).json({
//       message: "unauthorized ",
//     });
//   }
// };

// const updateProducts = async (req, res) => {
//   console.log(req.headers.token);
//   try {
//     var decoded = jwt.verify(req.headers.token, "secret");
//     console.log(decoded);
//     await Product.updateOne({ _id: req.params.id }, req.body);
//     res.json({
//       message: "products updated successsfully!",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(401).json({
//       message: "unauthorized ",
//     });
//   }
// };

// const deleteProducts = async (req, res) => {
//   console.log(req.headers.token);
//   try {
//     var decoded = jwt.verify(req.headers.token, "secret");
//     console.log(decoded);
//     await Product.deleteOne({ _id: req.params.id });
//     res.json({
//       message: "product deleted successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(401).json({
//       message: "unauthorized ",
//     });
//   }
// };

const addProducts = async (req, res) => {
  console.log(req.file);
  await Product.create({
    name: req.body.name,
    image: req.file.filename,
    price: req.body.price,
    quantity: req.body.quantity,
    user: req.authUser._id,
  });
  res.json({
    message: "product added successfully",
  });
};

const updateProducts = async (req, res) => {
  await Product.updateOne({ _id: req.params.id }, req.body);
  res.json({
    message: "products updated successsfully!",
  });
};

const deleteProducts = async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.json({
    message: "product deleted successfully",
  });
};
const getProductsById = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (!product) {
    res.json({
      message: "product not found",
    });
    return;
  }
  res.json({
    message: "product fetched",
    data: product,
  });
};
const createOrder = async (req, res) => {
  const { products } = req.body;
  let total = 0;
  for (let product of products) {
    const dbProduct = await Product.findOne({ _id: product._id });
    product.price = dbProduct.price;
    total += product.quantity * product.price;
  }
  await Order.create({
    user: req.authUser._id,
    products,
    total,
  });
  res.json({
    message: "Order placed successfully",
  });
};

module.exports = {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
  getProductsById,
  createOrder,
};
