
const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();
    return res.json(spots);
    
});

router.get('/current', async (req, res, next) => {
    const { user } = req
    console.log("user")
})

module.exports = router;