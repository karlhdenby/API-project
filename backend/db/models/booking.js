"use strict";
const { Model, NOW } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Spots"
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users"
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toString(),
        }
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toString(),
          isAfterStartDate(value) {
            if (this.startDate && value <= this.startDate) {
              throw new Error('endDate must be after startDate');
            }
          }
        }
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
