const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 character or more."),
  handleValidationErrors,
];

router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  try {


    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });
    const safeUser = {
      firstName: firstName,
      lastName: lastName,
      id: user.id,
      email: user.email,
      username: user.username,
    };

    setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
    });
  } catch (error) {
    let emailAlreadyExists = User.findOne({ where: { email: req.body.email } });
    let userNameAlreadyExists = User.findOne({
      where: { username: req.body.username },
    });

    let errObj = {};
    if (emailAlreadyExists) errObj.email = "Email already in use";
    if (userNameAlreadyExists) errObj.username = "Username already in use";
    console.log(error);
    for (let a = 0; a < error.errors.length; a++) {
      errObj[error.errors[a].path] = error.errors[a].message;
    }
    res.status(500).json({
      message: "User already exists",
      errors: errObj,
    });
  }
});

module.exports = router;
