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

router.put('/:bookingId', async (req, res, next) => {
    const id = req.params.bookingId
    const booking = await Booking.findByPk(id)
    const body = req.body

    await booking.update(body)
})


module.exports = router