const mongoose = require("mongoose");
const { MONGO_DB_URI } = require("./constants");
const connectDB = async () => {
  try {
    console.log(MONGO_DB_URI);
    await mongoose.connect(MONGO_DB_URI);
    console.log("database connected");
  } catch (error) {
    console.log("database connection error", error);
  }
};

module.exports = connectDB;
