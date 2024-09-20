const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

const {Order} = require('./order')

const sequelize = new Sequelize('ecommerce', 'root', 'k82kk323', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Error connecting to database:', error));


const Return = sequelize.define('Return', {
  return_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model:'orders',
        key:'order_id'
    }
  },
  return_reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ticket_status:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Open'
  },
  comment_by_seller: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'N/A'
  },
},{
    timestamps:false
});

// Set up associations
Order.hasMany(Return, { foreignKey: 'order_id' });
Return.belongsTo(Order, { foreignKey: 'order_id' });

sequelize.sync();

module.exports = { Return };
