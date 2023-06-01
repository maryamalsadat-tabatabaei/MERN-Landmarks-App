const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  { timestamps: true }
);

// userSchema.pre("save", function (next) {
//   const user = this;

//   bcrypt.genSalt(12, function (err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, null, function (err, hashedPassword) {
//       if (err) return next(err);
//       user.password = hashedPassword;
//       next();
//     });
//   });
// });

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      email: this.email,
      iat: new Date().getTime(),
    },
    process.env.JWT_SALT,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
