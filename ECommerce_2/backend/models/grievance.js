const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');
const { models } = require("mongoose");
const mongoose = require('mongoose');
const { Return } = require('./return');


const sequelize = new Sequelize('ecommerce', 'root', 'k82kk323', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Error connecting to database:', error));


const Grievance = sequelize.define('Grievance', {
  grievance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  return_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model:'Returns',
        key:'return_id'
    }
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Return.hasMany( Grievance, { foreignKey: 'return_id' });
Grievance.belongsTo(Return, { foreignKey: 'return_id' });

sequelize.sync();
module.exports = { Grievance };
