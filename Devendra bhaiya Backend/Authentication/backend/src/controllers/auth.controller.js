const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    // 1. get data from body
    let { name, email, password, mobile } = req.body;

    // 2. validate that data
    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });

    //   3. check user exists or not
    let isExists = await UserModel.findOne({ email });

    // 4. return error when user exists
    if (isExists)
      return res.status(409).json({
        message: "Email is already exists",
        success: false,
      });

    //   5. password hash
    let hashPass = bcrypt.hashSync(password, 12);

    // 6. save user in db
    let user = await UserModel.create({
      name,
      email,
      password: hashPass,
      mobile,
    });

    // 7. generate token
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // 8. save token in cookies
    res.cookie("tala", token);

    // 9. send the res
    return res.status(201).json({
      success: true,
      message: "User registred successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Interbal server error",
      success: false,
    });
  }
};

const loginController = async (req, res) => {
  try {
    // 1. get data from body
    let { email, password } = req.body;

    // 2. validate that data
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });

    //   3. check user exists or not
    let isExists = await UserModel.findOne({ email });

    // 4. return error when user exists
    if (!isExists)
      return res.status(404).json({
        message: "user not found",
        success: false,
      });

    //   5. check password
    let checkPass = bcrypt.compareSync(password, isExists.password);

    if (!checkPass)
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });

    // 6. generate token
    let token = jwt.sign({ id: isExists._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // 7. save token in cookies
    res.cookie("tala", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    // 8. send the res
    return res.status(201).json({
      success: true,
      message: "user logged in",
      data: isExists,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Interbal server error",
      success: false,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("tala");

    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    console.log("logout error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};
