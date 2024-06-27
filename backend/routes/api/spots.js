
const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage } = require('../../db/models');
const { where } = require('sequelize');

async function calculateAvg(id) {
    const result = await Review.findAll({
        where: {
             spotId: id
        }
    })

    let count = result.length
    let total = 0;
    for (let a of result) {
        total += a.stars
    }
    if (count > 0) return total / count;
    else return null
}; 

async function findSpotImages(id) {
    const result = await SpotImage.findAll({
        where: {
            spotId: id
        }
    })
    return result
};

async function findOwner(id) {
    const result = await User.findOne({
        where: {
            id: id
        }
    })
    return result
};

async function makeSpots(array) {
    let newSpots = [];
    for (let spot of array) {
        let current = {};
        current.id = spot.id,
        current.ownerId = spot.ownerId,
        current.address = spot.address,
        current.city = spot.city,
        current.state = spot.state,
        current.country = spot.country,
        current.lat = spot.lat,
        current.lng = spot.lng,
        current.name = spot.name,
        current.description = spot.description,
        current.price = spot.price,
        current.createdAt = (spot.createdAt),
        current.updatedAt = (spot.updatedAt),
        current.avgRating = await calculateAvg(spot.id)
        current.previewImage = null
        newSpots.push(current)
    }
    return newSpots
};




router.get('/', async (req, res, next) => {
    
    const result = await Spot.findAll();


    return res.json(makeSpots(result))
});

router.get('/current', async (req, res, next) => {
    const { user } = req
    let userId = user.id
    const result = await Spot.findOne({
        where: {
            ownerId: userId
        }
    })
    return res.json(makeSpots(result))
})

router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId;
    const result = await Spot.findOne({
        where: {
            spotId: id
        }
    })
    return res.json(makeSpots(result))
})

module.exports = router;