const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.tala;

    if (!token)
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode)
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });

    let user = await UserModel.findById(decode.id);

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = authMiddleware;
