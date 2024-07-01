const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;

router.delete('/:imageId', async (req, res, next) => {
    const id = req.params.imageId
    const image = await SpotImage.findByPk(id)

    await image.destroy()
    return res.json({"message": "Successfully deleted"})
})

module.exports = router