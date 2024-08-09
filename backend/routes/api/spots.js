const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require("../../db/models");
const { where } = require("sequelize");
const { Op, Sequelize } = require("sequelize");
const { requireAuth } = require("../../utils/auth");

const formatDate = (date) => {
  const isoString = date.toISOString();
  return isoString.substring(0, 19).replace("T", " ");
};

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
      (current.lat = parseFloat(spot.lat)),
      (current.lng = parseFloat(spot.lng)),
      (current.name = spot.name),
      (current.description = spot.description),
      (current.price = parseInt(spot.price)),
      (current.createdAt = spot.createdAt),
      (current.updatedAt = spot.updatedAt),
      (current.avgRating = await calculateAvg(spot.id));
      try {
        if (spot.previewImage) current.previewImage = spot.previewImage
        else {
          let first = await findSpotImages(spot.id)
          current.previewImage = first[0].url
        }
        
      } catch (error) {
        newSpots.push(current);
      }
        

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
  current.lat = parseFloat(spot.lat);
  current.lng = parseFloat(spot.lng);
  current.name = spot.name;
  current.description = spot.description;
  current.price = parseFloat(spot.price);
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
      (current.lat = parseFloat(spot.lat)),
      (current.lng = parseFloat(spot.lng)),
      (current.name = spot.name),
      (current.description = spot.description),
      (current.price = parseFloat(spot.price)),
      (current.createdAt = spot.createdAt),
      (current.updatedAt = spot.updatedAt),
      (current.avgRating = await calculateAvg(spot.id));
      try {
        if (spot.previewImage) current.previewImage = spot.previewImage
        else {
          let first = await findSpotImages(spot.id)
          current.previewImage = first[0].url
        }
      } catch (error) {
        current.previewImage = false
        return current
      }
      
    
    return current
}

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  try {
    let spot = await Spot.findByPk(req.params.spotId);
    if (spot.ownerId !== req.user.id)
      return res
        .status(403)
        .json({ error: "Spot must belong to the current user" });
    let { url, preview } = req.body;
    if (preview === null || preview === undefined) preview = false
    if (!url) throw new Error();
    let newImage = await SpotImage.create({
      spotId: req.params.spotId,
      url,
      preview,
    });

    res.status(201).json({id: newImage.id, url: newImage.url, preview: newImage.preview});
  } catch (error) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

router.get("/:spotId/reviews", requireAuth, async (req, res, next) => {
  let spotId = req.params.spotId;
  try {
    let reviews = await Review.findAll({
      where: {
        spotId
      },
      include: [
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
      ],
    });

    
    let spot = await Spot.findByPk(spotId);
    
    if (!spot) {
      return res.status(404).json({ error: "Spot couldn't be found" });
    }
    
    if (reviews.length === 0) {
      return res.status(404).json({ error: "Reviews couldn't be found" });
    }
    return res.status(200).json({Reviews: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "An error occurred while fetching reviews" });
  }
});



router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  let { review, stars } = req.body;
  let { user } = req;
  let id = req.params.spotId;
  let spot = await Spot.findByPk(id);
  let oldRev = await Review.findOne({
    where: {
      spotId: id,
      userId: user.id,
    },
  });

  try {
    if (!review || !stars || !user || !spot || oldRev) throw new Error();
    let result = await Review.create({
      review,
      stars,
      spotId: id,
      userId: user.id,
    });
    return res.status(201).json(result);
  } catch (error) {
    if (!spot)
      return res.status(404).json({ message: "Spot couldn't be found" });
    else if (oldRev)
      return res
        .status(500)
        .json({ message: "User already has a review for this spot" });
    else
      return res.status(400).json({
        message: "Bad Request", // (or "Validation error" if generated by Sequelize),
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
  }
});

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  let id = req.params.spotId;
  let spot = await Spot.findByPk(id);

  let bookings = await Booking.findAll({
    where: {
      spotId: id,
    }
  });

  if (!spot)
    return res.status(404).json({ message: "Spot could not be found" });
  return res.status(200).json({ Bookings: bookings });
});

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === req.user.id) {
      return res.status(403).json({ message: "Cannot book your own spot" });
    }

    let { startDate, endDate } = req.body;
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (isNaN(newStartDate) || isNaN(newEndDate)) {
      return res.status(403).json({
        message: "Bad Request",
        errors: {
          startDate: "startDate is required",
          endDate: "endDate is required",
        },
      });
    }

    const now = new Date();
    if (newStartDate < now) {
      return res.status(400).json({
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
        spotId: spot.id,
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
      return res.status(400).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const result = await Booking.create({
      spotId: spot.id,
      userId: req.user.id,
      startDate: newStartDate,
      endDate: newEndDate,
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


router.delete("/:spotId", requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);

  try {
    if (spot.ownerId !== req.user.id)
      return res
        .status(403)
        .json({ error: "Spot must belong to the current user" });
    await spot.destroy();
  } catch (error) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  res.json({ message: "Successfully deleted" });
});
router.get("/current", requireAuth, async (req, res, next) => {
  let { user } = req
  let result = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });
  
  try {
    let resultArr = []
    for (let a of result) resultArr.push(await currentSpot(a))
    return res.json({Spots: resultArr});
  } catch (error) {
    if (!req.user.id) return res.json({ message: "Could not find user" });
    if (!result) return res.json({ message: "Could not find spots" });
    return res.status(404).json(error);
  }
});
// Create spot by ID
router.put("/:spotId", requireAuth, async (req, res, next) => {
  let body = req.body;
  let spotId = req.params.spotId;
  try {
    let spot = await Spot.findByPk(spotId);
    if (spot.ownerId !== req.user.id)
      return res
        .status(403)
        .json({ error: "Spot must belong to the current user" });
    if (!spot) throw new Error();
    await spot.update(body);

    return res.status(200).json(spot);
  } catch (error) {
    let spot = await Spot.findByPk(spotId);
    if (!spot)
      res.status(404).json({
        message: "Spot couldn't be found",
      });
    else
      res.status(400).json({
        message: "Bad Request", // (or "Validation error" if generated by Sequelize),
        errors: {
          address: "Street address is required",
          city: "City is required",
          state: "State is required",
          country: "Country is required",
          lat: "Latitude must be within -90 and 90",
          lng: "Longitude must be within -180 and 180",
          name: "Name must be less than 50 characters",
          description: "Description is required",
          price: "Price per day must be a positive number",
        },
      });
  }
});
router.get("/:spotId", async (req, res, next) => {
  try {
    let id = req.params.spotId;
    let result = await Spot.findByPk(id);
    return res.json(await makeSpotsById(result));
  } catch (error) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
});
// Create New Spot
router.post("/", requireAuth, async (req, res, next) => {
  let { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  let { user } = req;
  let id = user.id;

  try {
    if (
      !address ||
      !city ||
      !state ||
      !country ||
      !lat ||
      !lng ||
      !name ||
      !description ||
      !price
    )
      throw new Error();
    let newSpot = await Spot.create({
      ownerId: id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.status(201).json(newSpot);
  } catch (error) {
    return res.status(400).json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude must be within -90 and 90",
        lng: "Longitude must be within -180 and 180",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day must be a positive number",
      },
    });
  }
});

router.get("/", async (req, res, next) => {
  let errors = {};
  let where = {};
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  if (!page) page = 1;
  if (!size) size = 20;

  if (page < 1) {
    errors.page = "Page must be greater than or equal to 1";
  }
  if (size < 1) {
    errors.size = "Size must be greater than or equal to 1";
  }

   if (minLat) {
    if (minLat < -90 || minLat > 90) errors.minLat = "Minimum latitude is invalid";
    else where.lat = { ...where.lat, [Sequelize.Op.gte]: minLat };
  }
  if (maxLat) {
    if (maxLat < -90 || maxLat > 90) errors.maxLat = "Maximum latitude is invalid";
    else where.lat = { ...where.lat, [Sequelize.Op.lte]: maxLat };
  }
  if (minLng) {
    if (minLng < -180 || minLng > 180) errors.minLng = "Minimum longitude is invalid";
    else where.lng = { ...where.lng, [Sequelize.Op.gte]: minLng };
  }
  if (maxLng) {
    if (maxLng < -180 || maxLng > 180) errors.maxLng = "Maximum longitude is invalid";
    else where.lng = { ...where.lng, [Sequelize.Op.lte]: maxLng };
  }
  if (minPrice) {
    if (minPrice < 0) errors.minPrice = "Minimum price must be greater than or equal to 0";
    else where.price = { ...where.price, [Sequelize.Op.gte]: minPrice };
  }
  if (maxPrice) {
    if (maxPrice < 0) errors.maxPrice = "Maximum price must be greater than or equal to 0";
    else where.price = { ...where.price, [Sequelize.Op.lte]: maxPrice };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors });
  }

  try {
    let result = await Spot.findAll({
      where: where,
      limit: size,
      offset: (page - 1) * size,
    });
    let done = await makeSpots(result);
    return res.json({ Spots: done });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
