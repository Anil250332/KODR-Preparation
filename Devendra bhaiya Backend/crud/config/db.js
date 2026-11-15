const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0/kodr5");
    console.log("mongodb connected");
  } catch (error) {
    console.log("errror in mongodb connection", error);
  }
};

module.exports = connectDB;
