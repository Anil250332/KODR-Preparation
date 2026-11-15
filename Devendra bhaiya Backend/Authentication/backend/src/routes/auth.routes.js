const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// hydration
router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Loggedin User",
    success: true,
    data: req.user,
  });
});

router.post("/register", registerController);
router.post("/login", loginController);

router.post("/logout", logoutController);

module.exports = router;
