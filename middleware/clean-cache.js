const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  //after all the middleware and logic resolves
  await next();
  clearHash(req.userData.userId);
};
