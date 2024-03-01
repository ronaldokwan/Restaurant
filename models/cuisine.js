"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuisine.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Cuisine.belongsTo(models.User, {
        foreignKey: "authorId",
      });
    }
  }
  Cuisine.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name should not be null",
          },
          notEmpty: {
            msg: "name should not be empty",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "description should not be null",
          },
          notEmpty: {
            msg: "description should not be empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price should not be null",
          },
          notEmpty: {
            msg: "Price should not be empty",
          },
          min: {
            args: [1],
            msg: "Min price = $1",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "imgUrl should not be null",
          },
          notEmpty: {
            msg: "imgUrl should not be empty",
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: "categoryId should not be null",
          },
          notEmpty: {
            msg: "categoryId should not be empty",
          },
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: "authorId should not be null",
          },
          notEmpty: {
            msg: "authorId should not be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cuisine",
    }
  );
  return Cuisine;
};
