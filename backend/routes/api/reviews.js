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

router.put('/:reviewId', async (req, res, next) => {
  let body = req.body
  let reviewId = req.params.reviewId
  let review = await Review.findByPk(reviewId)
  await review.update(body)

  return res.status(200).json(review)
})

router.delete('/:reviewId', async (req, res, next) => {
  let reviewId = req.params.reviewId
  let review = await Review.findByPk(reviewId)
  let reviewImage = await ReviewImage.findOne({
    where: {
      reviewId: reviewId
    }
  })
  await review.destroy()
  await reviewImage.destroy()

  res.json({"message": "Successfully deleted"})
})

module.exports = router;