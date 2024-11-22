const { body } = require("express-validator");
const { validate } = require("../middleware/validator.middleware");
const signUpValidator = [
  body("name").isString().notEmpty(),
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
