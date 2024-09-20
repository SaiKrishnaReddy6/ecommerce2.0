const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = new Sequelize("banks", "root", "k82kk323", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error connecting to database:", error));



const Bank = sequelize.define(
  "BankDetails",
  {
    bank_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_care_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "bankdetails",
  }
);


const AccountDetails = sequelize.define('Accountdetails', {
  accountholder_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountholder_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  account_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  mobile_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  account_balance: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  bank_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bankdetails',
      key: 'bank_id'
    }
  },
  IFSC_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  account_pin: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  timestamps:false
});

// module.exports = AccountDetails;


Bank.associate = (models) => {
  Bank.hasMany(models.AccountDetails, { foreignKey: "bank_id" });
  // Bank.hasMany(models.CustomersAccount, { foreignKey: "bank_id" });
  // Bank.hasMany(models.AdvertisersAccount, { foreignKey: "bank_id" });
};

sequelize.sync();

module.exports = { Bank,AccountDetails};
