const express = require("express");
const passport = require("passport");

const router = express.Router();
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/callback",
  passport.authenticate("google", {
    // successRedirect: process.env.CLIENT_URL,
    successRedirect: "/auth/google/callback/success",
    failureRedirect: "/auth/google/callback/failure",
  })
);
// Success
router.get("/callback/success", (req, res) => {
  console.log("succeed");
  if (!req.user) res.redirect("/auth/callback/failure");
  res.redirect("/api/users");
});
// failure
router.get("/callback/failure", (req, res) => {
  console.log("Log in failure");

  res.redirect("/api/users/login");
  //   res.status(401).json({
  //     error: true,
  //     message: "Log in failure",
  //   });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/api/users/login");
  //   res.redirect(process.env.CLIENT_URL);
});

// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Successfully Loged In",
//       user: req.user,
//     });
//   } else {
//     res.status(403).json({ error: true, message: "Not Authorized" });
//   }
// });
module.exports = router;
