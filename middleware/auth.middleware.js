// const { JWT_SECRET } = require("../config/constants");
const jwt = require("jsonwebtoken");
const checkAuth = (role) => {
  return (req, res, next) => {
    try {
      const decoded = jwt.verify(req.headers.token, "secret");
      req.authUser = decoded;
      console.log(decoded);
      if (role && !req.authUser.roles.includes(role)) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "unauthorized ",
      });
    }
  };
};

const checkAuthOld = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.token, "secret");
    req.authUser = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "unauthorized ",
    });
  }
};

const checkAuthAdmin = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.token, "secret");
    req.authUser = decoded;
    if (req.authUser.roles.include("Admin")) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "unauthorized ",
    });
  }
};
module.exports = {
  checkAuth,
};
