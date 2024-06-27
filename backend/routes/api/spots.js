
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
    const spots = await Spot.findAll();
    for (let spot of spots) {
        debugger
        spot.avgRating = await calculateAvg(spot);
    }
    
    return res.json({"Spots": spots});
    
});

router.get('/current', async (req, res, next) => {
    const { user } = req
    let userId = user.id
    const result = await Spot.findOne({
        where: {
            ownerId: userId
        }
    })
    return res.json(result)
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const result = await Spot.findOne({
        where: {
            ownerId: id
        }
    })
    return res.json(result)
})

module.exports = router;