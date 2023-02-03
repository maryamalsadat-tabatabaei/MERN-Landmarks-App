const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const cookieSession = require("cookie-session");
const passport = require("passport");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const googleAuthRoutes = require("./routes/google-auth-routes");
const HttpError = require("./models/http-error");
require("./services/passport");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,DELETE,PATCH");
  next();
});

app.use(
  cookieSession({
    name: "google-auth-session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth/google", googleAuthRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Sorry, Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  //rollback image upload
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@node-project.6mr8s0d.mongodb.net/${process.env.MONGO_DB_COLLECTION}`;

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected!");
    app.listen(process.env.MONGO_DB_PORT);
  })
  .catch((err) => console.log(err));
