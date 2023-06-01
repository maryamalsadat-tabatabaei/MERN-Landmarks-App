const passport = require("passport");
const LocalStrategy = require("passport-local");

require("dotenv").config;
const User = require("../models/user");

const localOption = {
  usernameField: "email",
  passwordField: "password",
  session: false,
  passReqToCallback: true,
};

const localLogin = new LocalStrategy(
  localOption,
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: "Email does not exist" });
      }
      user.comparePassword(password, function (err, isMatch) {
        if (err) return done(err);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
);

passport.use(localLogin);
