const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

const routes = require("./routes");
const HttpError = require("./models/http-error");

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
if (["production", "ci"].includes(process.env.NODE_ENV)) {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve("client", "build", "index.html"));
  });
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,DELETE,PATCH");
  next();
});

app.use(passport.initialize());

require("./services/jwtStartegy");
require("./services/googleStartegy");
require("./services/localStrategy");

app.use("", routes);
// app.use((req, res, next) => {
//   throw new HttpError("Sorry, Could not find this route.", 404);
// });

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
