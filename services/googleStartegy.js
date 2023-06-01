const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config;
const User = require("../models/user");

//create googleoauth startegy
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

const googleOptions = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  Proxy: true,
  //   scope: ["profile", "email"],
  //   passReqToCallback: true,
};
const googleLogin = new GoogleStrategy(
  googleOptions,
  async (req, accessToken, refreshToken, profile, done) => {
    console.log("===== GOOGLE PROFILE =======");
    console.log("accessToken", accessToken);
    console.log("======== END ===========");

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

      done(null, createdUser);
    } catch (err) {
      done(err, null);
    }
  }
);

passport.use(googleLogin);
