const User = require("../../models/user");

module.exports = () => {
  return new User({}).save();
};
