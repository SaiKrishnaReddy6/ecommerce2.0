const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', 'k82kk323', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Error connecting to database:', error));


const Warehouse_sql = sequelize.define('Warehouse', {
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      warehouse_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      owner_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
});

const warehouseSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

warehouseSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) {
      return next(err);
    }
    this.password = passwordHash;
    next();
  });
});

warehouseSchema.methods.comparePassword = function(password, callback = () => {}) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      console.log(password,this.password)
      console.log(isMatch)
      
      if (err) {
        console.log(password,this.password)
        return callback(err);
      }
      
      callback(null, isMatch);
    });
  }

sequelize.sync();

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = { Warehouse, Warehouse_sql };
