const express = require("express");
const { signUp, signIn } = require("../controllers/auth.controller");
const router = express.Router();
const {
  signUpValidator,
  signInValidator,
} = require("../validators/auth.validator");
// const { query, body, validationResult } = require("express-validator");
// const { validate } = require("../models/User");

// app.get("/test", query("search").notEmpty(), (req, res) => {
//   const result = validationResult(req);
//   console.log(req.query.search, result);
//   if (result.errors.length > 0) {
//     res.status(400).json({
//       errors: result.errors,
//     });
//     return;
//   }
//   res.json({
//     message: "ok",
//   });
// });

router.post("/sign-up", signUpValidator, signUp);
router.post("/sign-in", signInValidator, signIn);

module.exports = router;
