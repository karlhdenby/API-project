'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Review } = require('../models');

const reviews = [
  {spotId: 1, userId: 2, review: "Great spot, very clean and comfortable.", stars: 5},
  {spotId: 2, userId: 3, review: "Nice location, but a bit noisy.", stars: 4},
  {spotId: 3, userId: 1, review: "Loved the place, will visit again!", stars: 5},
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await Review.bulkCreate(reviews);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Reviews', reviews, options);

  }
};
