const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { where } = require("sequelize");

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
  const result = await Spot.findAll();
  let done = await makeSpots(result);

  return res.json({ Spots: done });
});

router.get("/current", async (req, res, next) => {
  const { user } = req;
  let userId = user.id;
  const result = await Spot.findOne({
    where: {
      ownerId: userId,
    },
  });
  return res.json(await currentSpot(result));
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const result = await Spot.findOne({
    where: {
      id: id,
    },
  });
  return res.json(await makeSpotsById(result));
});

router.post('/', async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    try {
        const newSpot = await Spot.create({
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
        console.error('Error creating new spot:', error);
        res.status(500).json({ error: 'Failed to create spot' });
      }
})

router.post('/:spotId/images', async (req, res, next) => {
    const { url, preview } = req.body;

    try {
        const newImage = await SpotImage.create({
        url,
        preview
    })

    res.status(201).json(newImage);
    } catch (error) {
        console.error('Error creating new image:', error);
        res.status(500).json({ error: 'Failed to create spot' });
    }

})

router.put('/api/spots/:spotId', async (req, res, next) => {
    let body = req.body;
    let spotId = req.params.spotId;
    let spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })
    for (let a in body) {
        spot(a) = body(a)
    }

    return res.status(200).json(spot)
})

module.exports = router;
