const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email').exists({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email'),
    check('username').exists({ checkFalsy: true })
    .isLength({ min: 4 }).withMessage(
        'Please provide a username with at least 4 characters'
    ),check('username').not().isEmail().withMessage('Username cannot be an email.'),
    check('password').exists({ checkFalsy: true })
    .isLength({ min: 6 }).withMessage('Password must be 6 character or more.'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

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
        error: validateSignup.message
    });
});





module.exports = router;