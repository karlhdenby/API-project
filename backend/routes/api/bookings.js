const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking, Sequelize } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;
const { requireAuth } = require("../../utils/auth");
const { Op } = require ('sequelize')

router.get('/current', requireAuth, async (req, res, next) => {
  
  
  try {
      const { user } = req
      let bookings = await Booking.findAll({
        where: {
          userId: req.user.id
        },
        include: [
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
          }
        ]
        })

        bookings = bookings.map(review => {
          console.log(review)
          if (review.Spot && review.Spot.SpotImages && review.Spot.SpotImages.length > 0) {
            review.Spot.previewImage = review.Spot.SpotImages[0].url;
          } else {
            review.Spot.previewImage = null;
          }
        
          delete review.Spot.SpotImages;
        
          return review;
        });

      return res.json({Bookings: bookings})
    } catch (error) {
      return res.json({user: "null"})
    }

})

router.put('/:bookingId', requireAuth, async (req, res, next) => {
  try {
    const id = req.params.bookingId;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (req.user.id !== booking.userId) {
      return res.status(403).json({ error: "Booking must belong to the current user" });
    }

    const { startDate, endDate } = req.body;
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (isNaN(newStartDate) || isNaN(newEndDate)) {
      return res.status(403).json({
        message: "Validation error",
        errors: {
          startDate: "startDate is required",
          endDate: "endDate is required",
        },
      });
    }

    if (newStartDate < new Date()) {
      return res.status(403).json({
        message: "Validation error",
        errors: {
          startDate: "startDate cannot be in the past",
        },
      });
    }

    if (newEndDate <= newStartDate) {
      return res.status(403).json({
        message: "Validation error",
        errors: {
          endDate: "endDate cannot be on or before startDate",
        },
      });
    }

    
    const conflictingBooking = await Booking.findOne({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: booking.id },
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: newEndDate,
            },
            endDate: {
              [Op.gte]: newStartDate,
            },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    await booking.update({ startDate: newStartDate, endDate: newEndDate });
    return res.json(booking);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  try {
      let booking = await Booking.findByPk(req.params.bookingId);

      if (!booking) {
          return res.status(404).json({"message": "Booking couldn't be found"});
      }

      if (booking.userId !== req.user.id) {
          return res.status(403).json({"error": "Cannot delete another user's booking"});
      }

      const bookingStartDate = new Date(booking.startDate).toISOString();
      const currentDate = new Date(Date.now()).toISOString();

      if (bookingStartDate < currentDate) {
          return res.status(403).json({"message": "Bookings that have been started can't be deleted"});
      }

      await booking.destroy();
      return res.json({"message": "Successfully deleted"});
      
  } catch (error) {
      next(error);
  }
});



module.exports = router