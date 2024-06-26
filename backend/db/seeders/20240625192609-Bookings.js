'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const bookings = [
  {spotId: 1, userId: 1, startDate: new Date("2024-07-01"), endDate: new Date("2024-07-05")},
  {spotId: 2, userId: 2, startDate: new Date("2024-07-06"), endDate: new Date("2024-07-10")},
  {spotId: 3, userId: 3, startDate: new Date("2024-07-11"), endDate: new Date("2024-07-15")},
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await Booking.bulkCreate(bookings);
  },

  async down (queryInterface, Sequelize) {
      options.tableName = "Bookings"
      const Op = Sequelize.Op;
      await queryInterface.bulkDelete("Bookings", bookings, options
   )},
 
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
};
