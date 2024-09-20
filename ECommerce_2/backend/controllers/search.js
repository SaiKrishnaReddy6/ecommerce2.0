const connection = require("../mysqldb");
//console.log(connection);

const searchItems = async(req,res)=>{
  //console.log(req.body.searchText);
  Str = req.body.searchText;
  searchStr = '%'+Str+'%'
  console.log(searchStr);
  var searchquery = `SELECT *
                     FROM items
                     INNER JOIN itemmodels ON items.item_id = itemmodels.item_id
                     INNER JOIN modelvariationtypes ON itemmodels.item_model_id = modelvariationtypes.item_model_id
                     INNER JOIN itemmodelvariants ON modelvariationtypes.variation_type_id = itemmodelvariants.variation_type_id
                     INNER JOIN inventory ON itemmodelvariants.product_id = inventory.product_id
                     INNER JOIN sellers ON inventory.seller_id = sellers.seller_id
                     WHERE (items.item_name LIKE ?
                            OR itemmodels.item_model_name LIKE ?
                            OR itemmodels.item_model_description LIKE ?)
                            AND inventory.quantity > 0`
  var values = [searchStr,searchStr,searchStr];
  connection.query(searchquery,values,(err,results,feilds) => {
    if(err){
      res.status(500).send({msg: err.message});
      return console.error('error1', err.message);
    }
    console.log('Item found : ' + results.affectedRows);
    res.status(200).send({msg:results});
  });
};

module.exports = {searchItems};
    // exports.searchItems = async(req,res)=> {
    //   console.log("Heree!!!");
    //   const searchStr = req.body;
    //   try {
    //     console.log(searchStr);
    //     const query = `SELECT *
    //                    FROM items
    //                    INNER JOIN itemmodels ON items.item_id = itemmodels.item_id
    //                    INNER JOIN modelvariationtypes ON itemmodels.item_model_id = modelvariationtypes.item_model_id
    //                    INNER JOIN itemmodelvariants ON modelvariationtypes.variation_type_id = itemmodelvariants.variation_type_id
    //                    INNER JOIN inventory ON itemmodelvariants.product_id = inventory.product_id
    //                    INNER JOIN sellers ON inventory.seller_id = sellers.seller_id
    //                    WHERE (items.item_name LIKE :searchStr
    //                           OR itemmodels.item_model_name LIKE :searchStr
    //                           OR itemmodels.item_model_description LIKE :searchStr)
    //                           AND inventory.quantity > 0`;
    
    //     const items = await sequelize.query(query, {
    //       replacements: { searchStr: `%${searchStr}%` },
    //       type: Sequelize.QueryTypes.SELECT,
    //     });
    //     console.log(items);
    //     console.log("There");
    //     return items;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    
    
// exports.searchItems = async (req,res) => {
//     const Str = req.body;
//     const searchString = `%${Str}%`;
//     const itemQuery = `
//     SELECT *
//     FROM items
//     INNER JOIN itemmodels ON items.item_id = itemmodels.item_id
//     INNER JOIN modelvariationtypes ON itemmodels.item_model_id = modelvariationtypes.item_model_id
//     INNER JOIN itemmodelvariants ON modelvariationtypes.variation_type_id = itemmodelvariants.variation_type_id
//     INNER JOIN inventory ON itemmodelvariants.product_id = inventory.product_id
//     INNER JOIN sellers ON inventory.seller_id = sellers.seller_id
//     WHERE items.item_name LIKE '%Str%' OR itemmodels.item_model_name LIKE '%Str%' OR itemmodels.item_model_description LIKE '%Str%' AND inventory.quantity>0;
    
//     `;
//     const itemsData = await sequelize.query(itemQuery, {
//       replacements: { search: searchString },
//       type: QueryTypes.SELECT,
//     });
//     const formattedItemsData = itemsData.map((item) => {
//       return {
//         item_name: item.item_name,
//         item_model_name: item.item_model_name,
//         item_model_description: item.item_model_description,
//         variation_in: item.variation_in,
//         variation_value: item.variation_value,
//         seller_organisation_name: item.seller_organisation_name,
//         price: item.price,
//       };
//     });
//     return formattedItemsData;
//   };
  


// exports.searchItems = async (req, res) => {
//   const { searchText } = req.body;
//   console.log(searchText);
//   try {
//     const items = await Item.findAll({
//       include: [
//         {
//           model: ItemModel,
//           include: [
//             {
//               model: ModelVariationType,
//               include: [
//                 {
//                   model: ItemModelVariant,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//       where: {
//         [Op.or]: [
//           {
//             item_name: {
//               [Op.like]: `%${searchText}%`,
//             },
//           },
//           {
//             "$itemmodels.item_model_name$": {
//               [Op.like]: `%${searchText}%`,
//             },
//           },
//           {
//             "$itemmodels.item_model_description$": {
//               [Op.like]: `%${searchText}%`,
//             },
//           },
//           {
//             "$itemmodels.modelvariationtypes.variation_in$": {
//               [Op.like]: `%${searchText}%`,
//             },
//           },
//           {
//             "$itemmodels.modelvariationtypes.itemmodelvariants.variation_value$": {
//               [Op.like]: `%${searchText}%`,
//             },
//           },
//         ],
//       },
//     });

//     const itemIds = items.map((item) => item.id);

//     const { count, rows } = await Inventory.findAndCountAll({
//         include: [
//           {
//             model: Seller,
//           },
//         ],
//         where: {
//           [Op.and]: [
//             {
//               product_id: {
//                 [Op.in]: itemIds,
//               },
//             },
//             {
//               quantity: {
//                 [Op.gt]: 0,
//               },
//             },
//           ],
//         },
//       });

//     const itemsData = result.map((item) => {
//       const itemDetails = {
//         item_name: item.item.item_name,
//         item_model_name: item.item.itemmodels[0].item_model_name,
//         item_model_description:
//           item.item.itemmodels[0].item_model_description,
//         variation_in:
//           item.item.itemmodels[0].modelvariationtypes[0].variation_in,
//         variation_value:
//           item.item.itemmodels[0].itemmodelvariants[0].variation_value,
//         seller_organisation_name: item.seller.seller_organisation_name,
//         price: item.price,
//       };
//       return itemDetails;
//     });
//     console.log(itemsData);
//     res.json(itemsData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server Error" });
//   }
// };


// SELECT item.id as item_id, item.item_name, itemmodels.id as item_model_id,
//            item_models.item_model_name, item_models.item_model_description,
//            model_variation_types.variation_in, item_model_variants.variation_value,
//            inventory.id as inventory_id, inventory.product_id, inventory.quantity,
//            inventory.price, sellers.id as seller_id, sellers.seller_organisation_name
//     FROM items as item
//     INNER JOIN item_models ON item.id = item_models.item_id
//     INNER JOIN model_variation_types ON item_models.id = model_variation_types.item_model_id
//     INNER JOIN item_model_variants ON item_models.id = item_model_variants.item_model_id
//     INNER JOIN inventory ON item_models.id = inventory.item_model_id
//     INNER JOIN sellers ON inventory.seller_id = sellers.id
//     WHERE (item.item_name LIKE :search OR item_models.item_model_name LIKE :search)
//       AND inventory.quantity > 0
//       AND inventory.product_id IN (
//         SELECT id FROM products WHERE category_id IN (
//           SELECT id FROM categories WHERE category_name LIKE :search
//         )
//       )


// SELECT *
// FROM items
// INNER JOIN itemmodels ON items.item_id = itemmodels.item_id
// INNER JOIN modelvariationtypes ON itemmodels.item_model_id = modelvariationtypes.item_model_id
// INNER JOIN itemmodelvariants ON modelvariationtypes.variation_type_id = itemmodelvariants.variation_type_id
// INNER JOIN inventory ON itemmodelvariants.product_id = inventory.product_id
// INNER JOIN sellers ON inventory.seller_id = sellers.seller_id
// WHERE items.item_name LIKE '%Str%' OR itemmodels.item_model_name LIKE '%Str%' OR itemmodels.item_model_description LIKE '%Str%' AND inventory.quantity>0;
