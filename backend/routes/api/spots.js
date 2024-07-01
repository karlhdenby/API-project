const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, Booking } = require("../../db/models");
const { where } = require("sequelize");
const { Op } = require('sequelize')

async function calculateAvg(id) {
  const result = await Review.findAll({
    where: {
      spotId: id,
    },
  });

  let count = result.length;
  let total = 0;
  for (let a of result) {
    total += a.stars;
  }
  if (count > 0) return total / count;
  else return null;
}

async function calculateTotal(id) {
  const result = await Review.findAll({
    where: {
      spotId: id,
    },
  });

  let count = result.length;
  return count;
}

async function findSpotImages(id) {
  const result = await SpotImage.findAll({
    where: {
      spotId: id,
    },
  });
  return result;
}

async function findOwner(ownerId) {
  const result = await User.findOne({
    where: {
      id: ownerId,
    },
  });
  return result;
}

async function makeSpots(array) {
  let newSpots = [];
  for (let spot of array) {
    let current = {};
    (current.id = spot.id),
      (current.ownerId = spot.ownerId),
      (current.address = spot.address),
      (current.city = spot.city),
      (current.state = spot.state),
      (current.country = spot.country),
      (current.lat = spot.lat),
      (current.lng = spot.lng),
      (current.name = spot.name),
      (current.description = spot.description),
      (current.price = spot.price),
      (current.createdAt = spot.createdAt),
      (current.updatedAt = spot.updatedAt),
      (current.avgRating = await calculateAvg(spot.id));
    current.previewImage = null;
    newSpots.push(current);
  }
  return newSpots;
}

async function makeSpotsById(spot) {
  let current = {};
  current.id = spot.id;
  current.ownerId = spot.ownerId;
  current.address = spot.address;
  current.city = spot.city;
  current.state = spot.state;
  current.country = spot.country;
  current.lat = spot.lat;
  current.lng = spot.lng;
  current.name = spot.name;
  current.description = spot.description;
  current.price = spot.price;
  current.createdAt = spot.createdAt;
  current.updatedAt = spot.updatedAt;
  current.numReviews = await calculateTotal(spot.id);
  current.avgStarRating = await calculateAvg(spot.id);
  current.SpotImages = await findSpotImages(spot.id);
  current.Owner = await findOwner(spot.ownerId);
  return current;
}

async function currentSpot(spot) {
  let current = {};
  (current.id = spot.id),
    (current.ownerId = spot.ownerId),
    (current.address = spot.address),
    (current.city = spot.city),
    (current.state = spot.state),
    (current.country = spot.country),
    (current.lat = spot.lat),
    (current.lng = spot.lng),
    (current.name = spot.name),
    (current.description = spot.description),
    (current.price = spot.price),
    (current.createdAt = spot.createdAt),
    (current.updatedAt = spot.updatedAt),
    (current.avgRating = await calculateAvg(spot.id));
    current.previewImage = null;
    return current;
}

router.get("/", async (req, res, next) => {
  let where = {}
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.params
  if (!page) page = 1
  if (!size) size = 1
  if (minPrice < 0 || maxPrice < 0) throw new Error()
  if (minLat) where.minLat = minLat
  if (maxLat) where.maxLat = maxLat
  if (minLng) where.minLng = minLng
  if (maxLng) where.maxLng = maxLng
  if (minPrice) where.minPrice = minPrice
  if (maxPrice) where.maxPrice = maxPrice
  let result = await Spot.findAll();
  let done = await makeSpots(result);
  try {
    if (minPrice < 0 || maxPrice < 0) throw new Error()
      let result = await Spot.findAll(
    {
      where: where,
      limit: size,
      offset: (page - 1) * size,
    });
      let done = await makeSpots(result);
      return res.json({ Spots: done });
  } catch (error) {
    return res.json({
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be greater than or equal to 1",
        "maxLat": "Maximum latitude is invalid",
        "minLat": "Minimum latitude is invalid",
        "minLng": "Maximum longitude is invalid",
        "maxLng": "Minimum longitude is invalid",
        "minPrice": "Minimum price must be greater than or equal to 0",
        "maxPrice": "Maximum price must be greater than or equal to 0"
      }
    })
  }

});

router.get("/current", async (req, res, next) => {
  let { user } = req;
  let userId = user.id;
  let result = await Spot.findOne({
    where: {
      ownerId: userId,
    },
  });
  return res.json(await currentSpot(result));
});

router.get("/:id", async (req, res, next) => {
  

  try {
    let id = req.params.id;
    let result = await Spot.findOne({
      where: {
        id: id,
      },
  });
  return res.json(await makeSpotsById(result));
    
  } catch (error) {
  return res.status(404).json({"message": "Spot couldn't be found"})
  }
});

router.post('/', async (req, res, next) => {
    let { address, city, state, country, lat, lng, name, description, price } = req.body;
    
    try {
      if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) throw new Error()
        let newSpot = await Spot.create({
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price
        });
    
        res.status(201).json(newSpot);
      } catch (error) {
        res.json(
          {
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
              "address": "Street address is required",
              "city": "City is required",
              "state": "State is required",
              "country": "Country is required",
              "lat": "Latitude must be within -90 and 90",
              "lng": "Longitude must be within -180 and 180",
              "name": "Name must be less than 50 characters",
              "description": "Description is required",
              "price": "Price per day must be a positive number"
            }
          }
        )
      }
})

router.post('/:spotId/images', async (req, res, next) => {
    let { url, preview } = req.body;

    try {
      if (!url || !preview) throw new Error()
        let newImage = await SpotImage.create({
        url,
        preview
    })

    res.status(201).json(newImage);
    } catch (error) {
        return res.json({
          "message": "Spot couldn't be found"
        })
    }

})

router.put('/:spotId', async (req, res, next) => {
  let body = req.body
  let spotId = req.params.spotId;
  try {
    let spot = await Spot.findByPk(spotId)
    if (!spot) throw new Error()
    await spot.update(body)


    return res.status(200).json(spot)
    
  } catch (error) {
    let spot = await Spot.findByPk(spotId)
    if (!spot) return res.json({
      "message": "Spot couldn't be found"
    })
    else res.json(
      {
        "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
        "errors": {
          "address": "Street address is required",
          "city": "City is required",
          "state": "State is required",
          "country": "Country is required",
          "lat": "Latitude must be within -90 and 90",
          "lng": "Longitude must be within -180 and 180",
          "name": "Name must be less than 50 characters",
          "description": "Description is required",
          "price": "Price per day must be a positive number"
        }
      }
    )
  }
})

router.delete('/:spotId', async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId)
    
    try {
      await spot.destroy()
      res.json({"message": "Successfully deleted"})
    } catch (error) {
      res.json({"message": "Spot couldn't be found"})
    }
})

router.get("/:spotId/reviews", async (req, res, next) => {
  let id = req.params.spotId;
  let result = await Review.findAll({
    where: {
      spotId: id,
    },
  });
  try {
    return res.json(result);
  } catch (error) {
    return res.json({"message": "Spot couldn't be found"})
  }
  
});

router.post("/:spotId/reviews", async (req, res, next) => {
  let { review, stars } = req.body;
  let { user } = req;
  let id = req.params.spotId;
  
  
  try {
    let spot = await Spot.findByPk(id)
    let oldRev = await Review.findOne({
      where: {
        spotId: id,
        userId: user.id
      }
    }) 
  if (!review || !stars || !user || !spot ) throw new Error()
    let result = await Review.create({
      review,
      stars,
      spotId: id,
      userId: user.id
    });
    return res.json(result)
  } catch (error) {

    if (!spot) return res.json({"message": "Spot couldn't be found"})
    else if (oldRev) return res.json({"message": "User already has a review for this spot"})
    else return res.json(
      {
        "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
        "errors": {
          "review": "Review text is required",
          "stars": "Stars must be an integer from 1 to 5",
        }
      })
  }

  


});


router.get('/:spotId/bookings', async (req, res, next) => {
  let id = req.params.spotId
  let spot = await Spot.findByPk(id)

  let bookings = await Booking.findAll({
    where: {
      spotId: id
    }
  })

  try {
    return res.json(bookings)
    
  } catch (error) {
    return res.json({"message": "Spot couldn't be found"})
  }
})

router.post('/:spotId/bookings', async (req, res, next) => {
  let id = req.params.spotId
  let spot = Spot.findByPk(id)
  let {startDate, endDate} = req.body
  
  try {
    if (!spot || !startDate || !endDate) throw new Error()
    let booking = await Booking.findOne({
      where: {
          startDate: startDate,
          endDate: endDate
      }
    })
    let result = await Booking.create({
      startDate,
      endDate
    })
    if (!spot) {
      throw new Error()
      return res.json({"message": "Spot couldn't be found"})
    }
    return res.json(result)
    
  } catch (error) {
    if (booking) return res.json(
      {
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      })
    else return res.json({
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "startDate": "startDate cannot be in the past",
        "endDate": "endDate cannot be on or before startDate"
      }
    })
    
  }

  
})



module.exports = router;