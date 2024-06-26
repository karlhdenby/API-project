'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  { spotId: 1, url: "https://example.com/spot1.jpg", preview: true},
  { spotId: 2, url: "https://example.com/spot2.jpg", preview: true},
  { spotId: 3, url: "https://example.com/spot3.jpg", preview: true},
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    
    
     await SpotImage.bulkCreate(spotImages,  { validate: true });
  
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages"
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete("SpotImages", spotImages, options);
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
