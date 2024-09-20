const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = new Sequelize('ecommerce', 'root', 'k82kk323', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  sequelize
    .authenticate()
    .then(() => console.log('Database connected'))
    .catch((error) => console.log('Error connecting to database:', error));

const {
  Item,
  ItemModel,
  ModelVariationType,
  ItemModelVariant,
} = require("../models/item");
const { Seller, Seller_sql } = require("./seller");

const Inventory = sequelize.define(
  "Inventory",
  {
    inventory_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "itemmodelvariants",
        key: "product_id",
      },
    },
    seller_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "sellers",
        key: "seller_id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "Inventory",
  }
);


Inventory.associate = () => {
  Inventory.belongsTo(ItemModelVariant, { foreignKey: "product_id" });
  Inventory.belongsTo(Seller, { foreignKey: "seller_id" });
};

sequelize.sync();

module.exports={Inventory};
