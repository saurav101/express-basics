const { validationResult } = require("express-validator");
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.errors.length > 0) {
    res.status(400).json({
      errors: result.errors,
    });
    return;
  }
  next();
};
module.exports = {
  validate,
};
