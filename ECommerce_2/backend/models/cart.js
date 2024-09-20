const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");

const Inventory = require('../models/inventory');
const { models } = require("mongoose");
//console.log(Inventory);
const sequelize = new Sequelize("ecommerce", "root", "k82kk323", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error connecting to database:", error));

// define Cart model
const Cart = sequelize.define('Cart', {
  cart_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

// define CartItem model
const CartItem = sequelize.define('CartItem', {
  cart_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  inventory_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "inventory",
      key: "inventory_item_id",
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
  cart_id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    references:{
        model: "carts",
        key: "cart_id",
    }
  }
});

// define associations between Cart and CartItem

// Cart.hasMany(CartItem, { foreignKey: 'cart_id',allowNull: false, });
// Cart.belongsTo(CartItem, { foreignKey: 'cart_id',allowNull: false, });
// define association between CartItem and Inventory
 // import Inventory model


// CartItem.associate = (models) =>{
//     CartItem.belongsTo(models.Cart,{foreignKey:"cart_id",allowNull: false});
//     CartItem.belongsTo(models.Inventory,{foreignKey:"inventory_item_id"})
// }

sequelize.sync();

module.exports = {
  Cart,
  CartItem
};
