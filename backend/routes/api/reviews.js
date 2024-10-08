const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;
const { requireAuth } = require("../../utils/auth");


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  let userId = req.user.id;
  let id = req.params.reviewId;
  let { url } = req.body;

  try {
    let review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({"message": "Review couldn't be found"});
    }

    if (review.userId !== userId) {
      return res.status(403).json({"message": "Cannot edit another user's review"});
    }

    const reviewImages = await ReviewImage.findAll({
      where: {
        reviewId: id
      }
    });

    if (reviewImages.length >= 10) {
      return res.status(403).json({message: "Review Image limit reached"});
    }

    let result = await ReviewImage.create({
      url,
      reviewId: id
    });

    return res.status(201).json(result);

  } catch (error) {
    next(error);
  }
});


router.put('/:reviewId', requireAuth, async (req, res, next) => {
  let body = req.body
  let reviewId = req.params.reviewId
  let review = await Review.findByPk(reviewId)
  
  try {
    if (review.userId !== req.user.id) return res.status(403).json({message: "Cannot edit another users review"})
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
        if (review.userId !== req.user.id) return res.status(403).json({message: "Review must belong to current user"})
        if(!review) throw new Error()
          await review.destroy()
        
        res.json({"message": "Successfully deleted"})
        
      } catch (error) {
        return res.status(404).json({"message": "Review couldn't be found"})
      }
    })
    router.get("/current", requireAuth, async (req, res, next) => {
      if (!req.user) return res.json({ user: "null" });
    
      try {
        let reviews = await Review.findAll({
          where: {
            userId: req.user.id
          },
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: Spot,
              attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
              include: [
                {
                  model: SpotImage,
                  attributes: ['url'],
                  required: true,
                }
              ]
            },
            {
              model: ReviewImage,
              attributes: ['id', 'url']
            },
          ]
        });
        
        const data = reviews.map(rev => {
    
          let review = rev.toJSON()
    
          let previewImage = review.Spot.SpotImages?.[0]?.url;
    
          if (previewImage === undefined) previewImage = null;
    
          review.Spot = {...review.Spot,previewImage};
    
          delete review.Spot.SpotImages;
        
          return review;
        });
    
        if (reviews.length > 0) {
          return res.json({ Reviews: data });
        } else {
          return res.status(400).json({ message: "no reviews found" });
        }
      } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
      }
    });

    
    module.exports = router;