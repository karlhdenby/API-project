const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;
const { requireAuth } = require("../../utils/auth");


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  let id = req.params.reviewId;
  let review = await Review.findByPk(id)
  let { url } = req.body
  if (review.userId !== req.user.id) return res.status(403).json({error: "Cannot edit another user's review"})

  try {
  if (req.user.id !== review.userId) throw new Error()
  const reviewImages = (await ReviewImage.findAll({
    where: {
      reviewId: id
    }}))

  if (reviewImages.length > 9) return res.status(403).json({error: "Review Image limit reached"})
    if (!review) throw new Error()
    let result = await ReviewImage.create({
    url,
    reviewId: id
  })
  
  return res.json(result)
} catch (error) {
  if (!review) return res.status(404).json({"message": "Review couldn't be found"})
  else res.status(404).json(error)
}


})

router.put('/:reviewId', requireAuth, async (req, res, next) => {
  let body = req.body
  let reviewId = req.params.reviewId
  let review = await Review.findByPk(reviewId)
  
  try {
    if (review.userId !== req.user.id) return res.status(403).json({error: "Cannot edit another users review"})
    if(!review) throw new Error()
      if(!body) throw new Error()
        await review.update(body)
  
      return res.status(200).json(review)
      
    } catch (error) {
      if(!review) res.status(404).json({"message": "Review couldn't be found"})
        else res.status(400).json({
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }
})

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  let reviewId = req.params.reviewId
  let review = await Review.findByPk(reviewId)
  // let reviewImage = await ReviewImage.findOne({
    //   where: {
      //     reviewId: reviewId
      //   }
      // })
      try {
        if (review.userId !== req.user.id) return res.status(403).json({error: "Review must belong to current user"})
        if(!review) throw new Error()
          await review.destroy()
        
        res.json({"message": "Successfully deleted"})
        
      } catch (error) {
        return res.json({"message": "Review couldn't be found"})
      }
    })
router.get("/current", requireAuth, async (req, res, next) => {
  if (!req.user.id) return res.json({ user: "null" });

  try {
    let reviews = await Review.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'] // Include only necessary attributes
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url'] // Include only necessary attributes
        }
      ]
    });

    if (reviews.length > 0) {
      return res.json({ Reviews: reviews });
    } else {
      return res.status(400).json({ message: "no reviews found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

    
    module.exports = router;