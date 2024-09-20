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

const Seller_sql = sequelize.define('Seller', {
  seller_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seller_organisation_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  mobile_number:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  address:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  gstIn:{
    type: DataTypes.STRING,
    allowNull: false
  }
});

const sellerSchema = new Schema({
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

sellerSchema.pre('save', function(next) {
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

sellerSchema.methods.comparePassword = function(password, callback = () => {}) {
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

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = { Seller, Seller_sql };
