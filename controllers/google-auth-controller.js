const { OAuth2Client } = require("google-auth-library");
const HttpError = require("../models/http-error");
const User = require("../models/user");
require("dotenv").config;

const googleClient = new OAuth2Client({
  clientId: `${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
});

export const authenticateUser = async (req, res) => {
  //   const { token } = req.body;

  //   const ticket = await googleClient.verifyIdToken({
  //     idToken: token,
  //     audient: `${process.env.GOOGLE_CLIENT_ID}`,
  //   });

  //   const profile = ticket.getPayload();

  //   let user = await User.findOne({ email: profile?.email });
  //   if (!user) {
  //     user = await new User({
  //       name: profile.displayName,
  //       email: profile.emails[0].value,
  //       image: imageUrl,
  //       //   password: hashedPassword,
  //       places: [],
  //     });

  //     await user.save();
  //   }
  //   res.json({
  //     userId: user.id,
  //     email: user.email,
  //     token,
  //   });
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      const existsInDB = DB.find((person) => person?.email === profile?.email);

      if (!existsInDB) {
        return res.status(400).json({
          message: "You are not registered. Please sign up",
        });
      }

      res.status(201).json({
        message: "Login was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
};
