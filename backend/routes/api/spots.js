
const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');

const { check, validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach((error) => 
            errors[error.path] = error.msg);
        
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll();
        return res.json(spots);
    } catch (error) {
        next(error);
    }
});

module.exports = router;