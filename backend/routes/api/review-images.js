const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;
const { requireAuth } = require("../../utils/auth");

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let image = await ReviewImage.findByPk(req.params.imageId)
    
    try {
        let review = await Review.findByPk(image.reviewId)
        if (review.userId !== req.user.id) return res.status(403).json({error: "Review must belong to current user"})
        await image.destroy()
        return res.json({"message": "Successfully deleted"})
        
    } catch (error) {
        return res.status(404).json({"message": "Review Image couldn't be found"})
    }
})


module.exports = router