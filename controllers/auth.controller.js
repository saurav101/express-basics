const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");
const signUp = async (req, res) => {
  try {
    const userExist = await User.findOne({
      email: req.body.email,
    });
    if (userExist) {
      res.status(400).json({
        message: "User Already Exists.Please Sign-In",
      });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "signed up successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
const signIn = async (req, res) => {
  //we can send directly req.body in findOne but we need to make sure only those two fields{email,password} are coming from the frontend.(we need to validate as well)
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      res.status(400).json({
        message: "invalid credentials",
      });
      return;
    }
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          roles: user.roles,
        },
        JWT_SECRET,
        {
          expiresIn: "10D",
        }
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 10);

      res.cookie("token", token, {
        httpOnly: true,
        expires: expiresAt,
      });

      delete user.password;

      res.status(200).json({
        message: "signed in successfully",
        token,
        data: user,
      });
      return;
    }
    res.status(400).json({
      message: "invalid credentials",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signUp,
  signIn,
};
