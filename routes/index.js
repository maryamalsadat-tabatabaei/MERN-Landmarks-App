const express = require("express");
const router = express.Router();
const placesRoutes = require("./places-routes");
const usersRoutes = require("./users-routes");
const localAuthRoutes = require("./localAuth");
const googleAuthRoutes = require("./googleAuth");

router.use("/auth", localAuthRoutes);
router.use("/auth/google", googleAuthRoutes);
router.use("/api/places", placesRoutes);
router.use("/api/users", usersRoutes);
//fallback 404
router.use("/api", (req, res, next) => {
  res.status(404).json("no route for this path");
});

module.exports = router;
