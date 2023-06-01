const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
require("dotenv").config;

const keygrip = new Keygrip([process.env.SESSION_COOKIE_KEY]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };

  const session = Buffer.from(
    JSON.stringify(sessionObject),
    toString("base64")
  );
  const sig = keygrip.sig("session=" + session);
  return { session, sig };
};
