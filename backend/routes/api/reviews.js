const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { where } = require("sequelize");

router.get("/current", async (req, res, next) => {
    const { user } = req;
    let userId = user.id;
    const result = await Review.findAll({
      where: {
        userId: userId,
      },
    });
    return res.json(await currentSpot(result));
  });

module.exports = router;