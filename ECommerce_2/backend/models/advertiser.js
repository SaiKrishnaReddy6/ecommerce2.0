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

const Advertiser_sql = sequelize.define('Advertiser', {
  advertiser_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  managerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contact_number:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  location:{
    type: DataTypes.STRING,
    allowNull: false,
  }
});

const advertiserSchema = new Schema({
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

advertiserSchema.pre('save', function(next) {
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

advertiserSchema.methods.comparePassword = function(password, callback = () => {}) {
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

const Advertiser = mongoose.model('Advertiser', advertiserSchema);

sequelize.sync();

module.exports = { Advertiser_sql, Advertiser };
