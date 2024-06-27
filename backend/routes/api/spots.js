
const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();
    return res.json(spots);
    
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

module.exports = router;