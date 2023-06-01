const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config;
const User = require("../models/user");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"), //ExtractJwt.fromAuthHeaderAsBearerToken()
  secretOrKey: process.env.JWT_SALT,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  console.log("jwt_payload", jwt_payload);

  try {
    const user = await User.findOne({ email: jwt_payload.email });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);
