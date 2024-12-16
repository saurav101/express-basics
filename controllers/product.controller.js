const { error } = require("console");
const Product = require("../models/Product");
// const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const fs = require("fs");
const stripe = require("stripe")(
  "sk_test_51QVUNBFYZdoxzDjJ04igkyJEXynllW96i5VUMfeelZ9skJnad4URiYCUxSL8ty1aTIa5nff2Vi1M02tZn5Nqcx2w00Sp0CZNzy"
);
const getOrders = async (req, res) => {
  const { limit, page, status } = req.query;
  const filter = {
    user: req.authUser._id,
  };
  if (status) {
    filter.status = status;
  }
  try {
    const orders = await Order.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);
    const total = await Order.countDocuments(filter); // Count total products
    res.json({
      total,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    search = "",
    priceOrder,
    minPrice,
    maxPrice,
  } = req.query;

  const filter = {};
  const sort = {};

  if (priceOrder) {
    sort.price = priceOrder;
  }

  if (minPrice && maxPrice) {
    filter.price = {
      $lte: minPrice,
      $gte: maxPrice,
    };
  }
  if (search) {
    filter.name = new RegExp(search, "i"); // Case-insensitive partial matching
  }
  try {
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit);
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
    featured: req.body.featured,
  });
  res.json({
    message: "Product added successfully!",
  });
};

const updateProducts = async (req, res) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
    user: req.authUser._id,
    featured: req.body.featured,
  };

  if (req?.file?.filename) {
    product.image = req.file.filename;
  }

  await Product.updateOne({ _id: req.params.id }, product);
  res.json({
    message: "Product updated successsfully!",
  });
};

const deleteProducts = async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.json({
    message: "Product deleted successfully!",
  });
};
const getProductsById = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (!product) {
    res.json({
      message: "Product not found!!",
    });
    return;
  }
  res.json({
    message: "Product fetched successfully!",
    data: product,
  });
};

const getFeaturedProducts = async (req, res) => {
  const featuredProducts = await Product.find({ featured: true }).limit(4);
  res.json({
    data: featuredProducts,
  });
};
const getLatestProducts = async (req, res) => {
  const latestProducts = await Product.find()
    .sort({ createdAt: "desc" })
    .limit(4);
  res.json({
    data: latestProducts,
  });
};

const createOrder = async (req, res) => {
  const { products } = req.body;
  let total = 0;
  const line_items = [];
  for (let product of products) {
    const dbProduct = await Product.findOne({ _id: product._id });
    product.price = dbProduct.price;
    total += product.quantity * product.price;
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: product.price * 100,
      product_data: {
        name: dbProduct.name,
      },
    });
    line_items.push({
      price: price.id,
      quantity: product.quantity,
    });
  }
  // await Order.create({
  //   user: req.authUser._id,
  //   products,
  //   total,
  // });
  const order = new Order({
    user: req.authUser._id,
    products,
    total,
  });

  const { _id: orderId } = await order.save();

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:5173/success",
    line_items,
    mode: "payment",
    metadata: {
      orderId: orderId.toString(),
    },
  });
  console.log(session);

  res.json({
    message: "Order placed successfully",
    url: session.url,
  });
};
module.exports = {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
  getProductsById,
  getFeaturedProducts,
  getLatestProducts,
  createOrder,
  getOrders,
};
