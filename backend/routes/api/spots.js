const express = require('express');
const router = require("./session");
const { Spot } = require('../../db/models')

const router = express.Router();

const validateLogin = [
    check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
    check('password').exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
    handleValidationErrors
];

router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll();
        return res.json(spots);
    } catch (error) {
        next(error);
    }
})

module.exports = router