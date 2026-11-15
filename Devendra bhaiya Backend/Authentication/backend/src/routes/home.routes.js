const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/home", authMiddleware, (req, res) => {
  res.send(req.user);
});

module.exports = router;
