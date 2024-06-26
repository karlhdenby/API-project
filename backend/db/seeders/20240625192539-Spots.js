'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spots = [
  {ownerId: 1, address: "123 Main St", city: "New York", state: "NY", country: "USA", lat: 40.7128, lng: -74.0060, name: "Central Park Spot", description: "A nice spot near Central Park.", price: 100.00},
  {ownerId: 2, address: "456 Elm St", city: "Los Angeles", state: "CA", country: "USA", lat: 34.0522, lng: -118.2437, name: "Hollywood Spot", description: "A nice spot near Hollywood.", price: 200.00},
  {ownerId: 3, address: "789 Oak St", city: "Chicago", state: "IL", country: "USA", lat: 41.8781, lng: -87.6298, name: "Downtown Spot", description: "A nice spot in downtown Chicago.", price: 150.00},
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(spots, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Spots', spots, options);
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
