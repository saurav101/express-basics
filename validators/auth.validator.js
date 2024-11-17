const { body } = require("express-validator");
const { validate } = require("../middleware/validator.middleware");
const signUpValidator = [
  body("email").isEmail(),
  body("password").isStrongPassword(),
  validate,
];

const signInValidator = [
  body("email").isEmail(),
  body("password").notEmpty(),
  validate,
];
module.exports = {
  signUpValidator,
  signInValidator,
};
