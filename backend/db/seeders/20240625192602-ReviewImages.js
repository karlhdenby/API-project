'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewImages = [
  {reviewId: 1, url: "https://example.com/review1.jpg"},
  {reviewId: 2, url: "https://example.com/review2.jpg"},
  {reviewId: 3, url: "https://example.com/review3.jpg"},
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "ReviewImages"
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete("ReviewImages", reviewImages, options)
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
