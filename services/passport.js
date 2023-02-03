const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

require("dotenv").config;
const User = require("../models/user");
const HttpError = require("../models/http-error");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

function extractProfile(profile) {
  let imageUrl = "";
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }

  return {
    name: profile.displayName,
    email: profile.emails[0].value,
    image: imageUrl,
  };
}

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      // proxy: true,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    // function (accessToken, refreshToken, profile, callback) {
    // 	callback(null, profile);
    // }
    async (req, accessToken, refreshToken, profile, done) => {
      console.log("===== GOOGLE PROFILE =======");
      console.log("accessToken", accessToken);
      console.log("======== END ===========");
      // const profileJson = profile._json;

      const { name, email, image } = extractProfile(profile);
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log("existingUser", existingUser);

          return done(null, existingUser);
        }

        const createdUser = new User({
          name,
          email,
          image,
          // password: hashedPassword,
          places: [],
        });

        try {
          await createdUser.save();
        } catch (err) {
          const error = new HttpError(
            "Signing in failed, please try again.",
            500
          );
          return next(error);
        }
        console.log("createdUser", createdUser);
        let token;
        try {
          token = jwt.sign(
            { userId: createdUser?.id, email: createdUser?.email },
            process.env.JWT_SALT,
            {
              expiresIn: "1h",
            }
          );
        } catch (err) {
          const error = new HttpError(
            "Could not logged you in. Please try again.",
            500
          );
          return next(error);
        }
        const userData = {
          userId: createdUser.id,
          email: createdUser.email,
          token,
        };
        req.user = userData;
        console.log("userData", userData);
        done(null, userData);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
