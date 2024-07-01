const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;

router.delete('/:imageId', async (req, res, next) => {
    const id = req.params.imageId
    const image = await ReviewImage.findByPk(id)
    try {
        await image.destroy()
        return res.json({"message": "Successfully deleted"})
        
    } catch (error) {
        return res.json({"message": "Review Image couldn't be found"})
    }
})


module.exports = router