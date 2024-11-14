const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/iBazaar");
    console.log("database connected");
  } catch (error) {
    console.log("database connection error", error);
  }
};

module.exports = connectDB;
