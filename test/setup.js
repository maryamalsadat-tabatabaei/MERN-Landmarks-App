require("../models/user");
const mongoose = require("mongoose");
require("dotenv").config;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { useMongoClient: true });
