const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, "Min 6 characters is required"],
  },
  mobile: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
