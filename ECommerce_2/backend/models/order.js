const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const CartItem = require('./cart');
const mongoose = require('mongoose');
const Warehouse = require('./warehouse');
const Coupon = require('./coupon');


const sequelize = new Sequelize('ecommerce', 'root', 'k82kk323', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Error connecting to database:', error));

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_email:{
    type: DataTypes.STRING,
    allowNull:false
  },
  customer_amount_received:{
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  advertiser_amount_paid:{
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  seller_amount:{
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  platform_commission:{
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  delivery_status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  return_status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  // bank_id:{
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  cart_item_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "cartitems",
      key: "cart_item_id",
    },
  },
  warehouse1_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "warehouses",
      key: "warehouse_id",
    },
  },
  warehouse2_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "warehouses",
      key: "warehouse_id",
    },
  },
  coupon_id:{
    type: DataTypes.INTEGER,
    references: {
      model: "coupons",
      key: "coupon_id",
    },
  }
});
sequelize.sync();
module.exports = {Order};

// Defining the associations between the Order model and the other models
// Order.belongsTo(CartItem, { foreignKey: 'cart_item_id' });
// Order.belongsTo(Warehouse, { as: 'warehouse1', foreignKey: 'warehouse1_id' });
// Order.belongsTo(Warehouse, { as: 'warehouse2', foreignKey: 'warehouse2_id' });
// Order.belongsTo(Coupon, { foreignKey: 'coupon_id' });

// module.exports = Order;
