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
//console.log("s",sequelize)

const Item = sequelize.define('Item', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const ItemModel = sequelize.define('ItemModel', {
  item_model_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  item_model_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_model_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

const ModelVariationType = sequelize.define('ModelVariationType', {
  variation_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  variation_in: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const ItemModelVariant = sequelize.define('ItemModelVariant', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  variation_value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the associations
Item.hasMany(ItemModel, { foreignKey: 'item_id' });
ItemModel.belongsTo(Item, { foreignKey: 'item_id' });

ItemModel.hasMany(ModelVariationType, { foreignKey: 'item_model_id' });
ModelVariationType.belongsTo(ItemModel, { foreignKey: 'item_model_id' });

ModelVariationType.hasMany(ItemModelVariant, { foreignKey: 'variation_type_id' });
ItemModelVariant.belongsTo(ModelVariationType, { foreignKey: 'variation_type_id' });

sequelize.sync();

module.exports = { Item, ItemModel, ModelVariationType, ItemModelVariant };
