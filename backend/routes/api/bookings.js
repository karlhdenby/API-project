const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;

router.get('/current', async (req, res, next) => {
    const { user } = req

    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    })

    return res.json(bookings)
})

module.exports = router