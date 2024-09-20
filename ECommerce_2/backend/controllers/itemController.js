const {
  Item,
  ItemModel,
  ModelVariationType,
  ItemModelVariant,
} = require("../models/item");

// exports.createItem = async (req, res) => {
//   try {
//     //console.log('In createItem');
//     const {
//       item_name,
//       item_model_name,
//       item_model_description,
//       variation_in,
//       variation_value,
//     } = req.body;

//     console.log(item_name);
//     const item = await Item.create({ item_name });

//     const itemModel = await ItemModel.create({
//       item_model_name,
//       item_model_description,
//       item_id: item.item_id,
//     });

//     const modelVariationType = await ModelVariationType.create({
//       variation_in,
//       item_model_id: itemModel.item_model_id,
//     });
//     console.log("3tables updated");
//     const itemModelVariant = await ItemModelVariant.create({
//       variation_type_id: modelVariationType.variation_type_id,
//       variation_value,
//     });

//     return res.status(201).json({ message: "Item created successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

exports.createItem = async (req, res) => {
  try {
    const {
      item_name,
      item_model_name,
      item_model_description,
      variation_in,
      variation_value,
    } = req.body;

    // Check if item already exists
    let item = await Item.findOne({ where: { item_name } });
    if (!item) {
      item = await Item.create({ item_name });
    }

    // Check if item model already exists
    let itemModel = await ItemModel.findOne({ 
      where: { 
        item_model_name,
        item_model_description,
        item_id: item.item_id,
      }
    });
    if (!itemModel) {
      itemModel = await ItemModel.create({
        item_model_name,
        item_model_description,
        item_id: item.item_id,
      });
    }

    // Check if model variation type already exists
    let modelVariationType = await ModelVariationType.findOne({ 
      where: { 
        variation_in,
        item_model_id: itemModel.item_model_id,
      }
    });
    if (!modelVariationType) {
      modelVariationType = await ModelVariationType.create({
        variation_in,
        item_model_id: itemModel.item_model_id,
      });
    }

    // Create item model variant
    let itemModelVariant = await ItemModelVariant.findOne({ 
      where: { 
        variation_type_id: modelVariationType.variation_type_id,
      variation_value,
      }
    });
    if (!itemModelVariant) {
      itemModelVariant = await ItemModelVariant.create({
        variation_type_id: modelVariationType.variation_type_id,
        variation_value,
      });
    }
    // const itemModelVariant = await ItemModelVariant.create({
    //   variation_type_id: modelVariationType.variation_type_id,
    //   variation_value,
    // });

    return res.status(201).json({ message: "Item created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: ItemModel,
          include: [
            {
              model: ModelVariationType,
              include: [ItemModelVariant],
            },
          ],
        },
      ],
    });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const { item_name } = req.body;

    const item = await Item.findByPk(item_id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.update({ item_name });

    return res.status(200).json({ message: "Item updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


exports.deleteItemByProductId = async (req, res) => {
  try {
    console.log("In delete product");
    const { product_id } = req.body;
    console.log(product_id);
    const product = await ItemModelVariant.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    await product.destroy();

    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
