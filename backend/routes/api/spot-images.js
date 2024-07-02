const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;
const { requireAuth } = require("../../utils/auth");

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId)
    
    try {
    let spot = await Spot.findByPk(image.spotId)
    if (spot.ownerId !== req.user.id) return res.status(403).json({error: "Spot must belong to the current user"})
        const id = req.params.imageId
        await image.destroy()
    } catch (error) {
        if (!image.spotId)return res.status(404).json({"message": "Spot Image couldn't be found"})
    }
    return res.json({"message": "Successfully deleted"})
})

module.exports = router