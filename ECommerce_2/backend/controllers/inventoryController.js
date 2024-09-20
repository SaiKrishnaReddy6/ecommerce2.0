const { Item, ItemModel, ItemModelVariant, ModelVariationType } = require('../models/item');
const {Inventory} = require('../models/inventory');
const { where } = require('sequelize');

const addingProductToInventory = async (req, res) => {
  const {
    item_name,
    item_model_name,
    item_model_description,
    variation_in,
    variation_value,
    quantity,
    price,
    seller_id,
  } = req.body;

  try {
    // check if the item exists in the Item table, otherwise create a new record
    let item = await Item.findOne({where:{item_name}});
    if (!item) {
      item = await Item.create({ item_name });
    }
    const item_id = item.item_id;
    // check if the item model exists in the ItemModel table, otherwise create a new record
    let itemModel = await ItemModel.findOne({where:{item_id,item_model_name, item_model_description}});
    if (!itemModel) {
      itemModel = await ItemModel.create({  item_id, item_model_name, item_model_description });
    }
    const item_model_id = itemModel.item_model_id;
    // check if the model variation type exists in the ModelVariationType table, otherwise create a new record
    let modelVariationType = await ModelVariationType.findOne({where:{item_model_id,variation_in}});
    if (!modelVariationType) {
      modelVariationType = await ModelVariationType.create({ item_model_id, variation_in });
    }
    const variation_type_id = modelVariationType.variation_type_id;
    // check if the item model variant exists in the ItemModelVariant table, otherwise create a new record
    let itemModelVariant = await ItemModelVariant.findOne({where:{variation_type_id,variation_value}});
    if (!itemModelVariant) {
      itemModelVariant = await ItemModelVariant.create({  variation_type_id, variation_value });
    }
    const product_id = itemModelVariant.product_id;
    // check if the inventory record exists, otherwise create a new record
    const [inventory, created] = await Inventory.findOrCreate({
      where: { product_id, seller_id },
      defaults: { quantity, price },
    });

    if (!created) {
      // if the inventory record already exists, update the quantity and price
      inventory.quantity = quantity;
      inventory.price = price;
      await inventory.save();
    }

    res.status(201).json({
      success: true,
      message: 'Product added to inventory successfully',
      data: inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error adding product to inventory',
      error: error.message,
    });
  }
};

// Update the quantity and price of a product in the inventory table
const updateProductInInventory = async (req, res) => {
    const { product_id, seller_id, quantity, price } = req.body;
    try {
      const inventory = await Inventory.findOne({
        where: { product_id, seller_id },
      });
      if (inventory) {
        inventory.quantity = quantity;
        inventory.price = price;
        await inventory.save();
        return res.status(200).json({
          message: 'Product quantity and price updated successfully',
          data: inventory,
        });
      } else {
        return res.status(404).json({
          message: 'Product not found in inventory',
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Error updating product in inventory',
        error: error.message,
      });
    }
  };

  const deleteProductFromInventory = async (req, res) => {
    const { product_id, seller_id } = req.body;
  
    try {
      const deletedProduct = await Inventory.destroy({
        where: { product_id, seller_id },
      });
      if (deletedProduct === 0) {
        return res.status(404).json({ error: 'Product not found in inventory' });
      }
      return res.json({ message: 'Product deleted from inventory' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error deleting product from inventory' });
    }
  };
  


module.exports = { addingProductToInventory,updateProductInInventory,deleteProductFromInventory};
