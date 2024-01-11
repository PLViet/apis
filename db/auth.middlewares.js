const jwtVariable = require('./variables/jwt');
const userModle = require('./user');
const authMethod = require('./auth.methods');
const path = require('path');

exports.isAuth = async (req, res, next) => {
  const accessToken = req.signedCookies.token;

  if (!accessToken) {
    return ["/register", "/login"].includes(req.route.path) ? next() : res.redirect(`/login`);
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const verified = await authMethod.verifyToken(accessToken, accessTokenSecret);

  if (!verified && req.route.path === "/api/docs") {
    return res.redirect(`/login`);
  }

  if (req.route.path === "/logout") {
    res.clearCookie("token");
  }

  req.user = await userModle.getUser(verified?.payload?.username);
  next();
};

exports.checkIsAuth = async (req, res, next) => {
  const accessToken = req.signedCookies.token;

  if (!accessToken && ["/register", "/login"].includes(req.route.path)) {
    return next();
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const verified = await authMethod.verifyToken(accessToken, accessTokenSecret);

  if (verified) {
    return res.redirect(`/home`);
  }

  next();
};
