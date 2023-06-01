const express = require("express");
const passport = require("passport");
const router = express.Router();
require("dotenv").config;

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    successRedirect: "/auth/google/callback/success",
    failureRedirect: "/auth/google/callback/failure",
  })
);
// Success
router.get("/callback/success", (req, res) => {
  console.log("succeeddddddddd", req);
  const token = req.user.generateJWT();
  res.cookie("x-auth-cookie", token);
  res.redirect("/api/users");
});
// failure
router.get("/callback/failure", (req, res) => {
  console.log("Log in failure");
  res.redirect("/api/users/login");
});

module.exports = router;
