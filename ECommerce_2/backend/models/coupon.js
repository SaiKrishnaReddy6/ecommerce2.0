const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const Advertiser = require('./advertiser');

const sequelize = new Sequelize("ecommerce", "root", "k82kk323", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error connecting to database:", error));

// define CartItem model
const Coupon = sequelize.define('Coupon', {
  coupon_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  coupon_code:{
    type: DataTypes.STRING,
    allowNull: false
  },
  advertiser_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "advertisers",
      key: "advertiser_id",
    },
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
});


Coupon.associate = (models) =>{
    CartItem.belongsTo(models.Advertiser,{foreignKey:"advertiser_id"})
}

sequelize.sync();

module.exports = {
  Coupon,Advertiser
};
