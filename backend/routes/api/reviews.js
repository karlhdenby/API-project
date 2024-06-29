const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { where } = require("sequelize");
const { currentSpot } = require('./spots') ;

router.get("/current", async (req, res, next) => {
    const { user } = req;
    let userId = user.id;
    const result = await Review.findByPk(userId);
    return res.json({result});
  });

module.exports = router;