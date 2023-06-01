const requireLocalAuth = require("../middleware/requireLocalAuth");
const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controller");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
require("dotenv").config;

router.post("/login", requireLocalAuth, (req, res, next) => {
  const token = req.user.generateJWT();
  res.json({
    userId: req.user.id,
    email: req.user.email,
    token: token,
  });
});

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/api/users/login");
});

module.exports = router;
