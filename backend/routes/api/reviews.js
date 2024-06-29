const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;

router.get("/current", async (req, res, next) => {
    const { user } = req;
    let userId = user.id;
    const result = await Review.findAll({
      where: {
        userId: userId
      }
    });
    return res.json(result);
  });

router.post('/:reviewId/images', async (req, res, next) => {
  const id = req.params.reviewId;
  const { url } = req.body;

  const result = await ReviewImage.create({
    url,
    reviewId: id
  })

  return res.json(result)

})


module.exports = router;