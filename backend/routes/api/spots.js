
const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');

async function calculateAvg(id) {
    const result = await Review.findAll({
        where: {
             spotId: id
        }
})  
    let total = 0;
    let count = 0;
    for (let a of result) {
        count ++;
        total += a.stars
    }
    return total / count
}




router.get('/', async (req, res, next) => {
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
    }
    return res.json(newSpots)
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

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const result = await Spot.findOne({
        where: {
            ownerId: id
        }
    })
    return res.json(makeSpots(result))
})

module.exports = router;