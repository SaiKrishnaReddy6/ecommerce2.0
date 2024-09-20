const bcrypt = require('bcrypt');
const { Seller, Seller_sql } = require('../models/seller');
const {Return} = require('../models/return');
const {Order} = require('../models/order')
const {AccountDetails} = require('../models/bank');
const connection = require("../mysqldb");

exports.sellersInventory = async (req, res) => {
  const { email } = req.body;
  var searchquery = `SELECT im.item_model_name,mvt.variation_in,imv.variation_value, inv.quantity, inv.price
  FROM Items i
  INNER JOIN ItemModels im ON i.item_id = im.item_id
  INNER JOIN ModelVariationTypes mvt ON im.item_model_id = mvt.item_model_id
  INNER JOIN ItemModelVariants imv ON mvt.variation_type_id = imv.variation_type_id
  INNER JOIN Inventory inv ON imv.product_id = inv.product_id
  INNER JOIN Sellers s ON inv.seller_id = s.seller_id
  WHERE s.email = ?;
  `
  var values = [email];
  connection.query(searchquery,values,(err,results,feilds) => {
    if(err){
      res.status(500).send({msg: err.message});
      return console.error('error1', err.message);
    }
    console.log('Item found : ' + results.affectedRows);
    res.status(200).send({msg:results});
  });
};


exports.salesDashboard = async (req, res) => {
  const { email } = req.body;
  var searchquery = `SELECT im.item_model_name,mvt.variation_type,inv.variation_value,  ci.quantity, ci.price, cust.name, o.order_id, o.delivery_status,o.return_status
  FROM Items i
  INNER JOIN ItemModels im ON i.item_id = im.item_id
  INNER JOIN ModelVariationTypes mvt ON im.item_model_id = mvt.item_model_id
  INNER JOIN ItemModelVariants imv ON mvt.variation_type_id = imv.variation_type_id
  INNER JOIN Inventory inv ON imv.product_id = inv.product_id
  INNER JOIN Sellers s ON inv.seller_id = s.seller_id
  INNER JOIN CartItems ci ON inv.inventory_item_id = ci.inventory_item_id
  INNER JOIN Orders o ON ci.cart_item_id = o.cart_item_id
  INNER JOIN Customers cust ON o.customer_email = cust.email
  WHERE s.email = ?;
  `
  var values = [email];
  connection.query(searchquery,values,(err,results,feilds) => {
    if(err){
      res.status(500).send({msg: err.message});
      return console.error('error1', err.message);
    }
    console.log('Item found : ' + results.affectedRows);
    res.status(200).send({msg:results});
  });
};

exports.register = async (req, res) => {
  const {
    name,
    seller_organisation_name,
    email,
    password,
    mobile_number,
    address,
    gstIn
  } = req.body;
  console.log(email);
  try {
    // Check if Seller with the same email already exists
    const user = await Seller.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: 'Seller with the same email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Seller in MongoDB
    const newSeller = new Seller({
      email: email,
      password: hashedPassword
    });
    await newSeller.save();

    // Create new Seller in SQL
    const seller = await Seller_sql.create({
      name,
      seller_organisation_name,
      email,
      mobile_number,
      address,
      gstIn
    });
    console.log(seller);
    res.status(201).json({ message: 'Seller created successfully' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find Seller with the given email
  Seller.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare password
      return user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: err });
        }

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ message: 'Login successful' });
      });
    })
    .catch(err => {
      return res.status(500).json({ message: err });
    });
};

exports.acceptReturn = async (req,res)=>{
  const {comment_by_seller,return_id,email} = req.body;///seller email from local storage
  try {
    const returnitem = await Return.findOne({where:{return_id : return_id}});
    if(!returnitem){
      return res.status(404).json({message : 'No such return_id'})
    }
    await returnitem.update({ ticket_status: 'Closed', comment_by_seller:comment_by_seller});
    const order = await Order.findOne({ where: { order_id: returnitem.order_id } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Update the order status to 'Return Rejected'
    await order.update({ return_status: 'Return Accepted' });
    //await order.update({ return_status: 'Return Accepted' });
    const selleraccount =await AccountDetails.findOne({where:{accountholder_email:email}})
    const cust_email = order.customer_email
    //const bank_id = order.bank_id
    custaccount = await AccountDetails.findOne({where:{accountholder_email : cust_email}})
    const amount_to_be_credited_back = parseFloat(order.customer_amount_received)
    const amount_to_platform = parseFloat(order.seller_amount) - parseFloat(amount_to_be_credited_back)
    const platform =await AccountDetails.findOne({where:{accountholder_email : 'platform@gmail.com'}})
    await custaccount.update({account_balance : parseFloat(custaccount.account_balance) + parseFloat(amount_to_be_credited_back)})
    await platform.update({account_balance: parseFloat(platform.account_balance) + parseFloat(amount_to_platform)})
    console.log(parseFloat(order.seller_amount))
    console.log(parseFloat(selleraccount.account_balance) - parseFloat(order.seller_amount));
    await selleraccount.update({account_balance: parseFloat(selleraccount.account_balance) - parseFloat(order.seller_amount)})
    return res.status(200).json({message:'Return Accepted! Amount has been credited!'})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message : 'Internal Server Error'})
  }
}

exports.rejectReturn = async(req,res)=>{
  const {comment_by_seller,return_id} = req.body;
  try {
    const returnitem = await Return.findOne({where:{return_id}});
    //console.log(returnitem)
    const order = await Order.findOne({ where: { order_id: returnitem.order_id } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the order status to 'Return Rejected'
    //await order.update({ return_status: 'Return Rejected' });
    //const order_id = returnitem.order_id;
    //console.log(order_id)
    //const order1 = Order.findOne({where:{order_id : order_id}})
    if(!returnitem){
      return res.status(400).json({message : 'No such return_id'})
    }
    await returnitem.update({ ticket_status: 'Closed', comment_by_seller:comment_by_seller});
    console.log('Until Here!!')
    await order.update({ return_status: 'Return Rejected' });
    return res.status(200).json({message:'Rejected!!'})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message : 'Internal Server Error'})
  }

}

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
