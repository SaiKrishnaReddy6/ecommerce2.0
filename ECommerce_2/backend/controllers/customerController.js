const bcrypt = require("bcrypt");
const { Customer, Customer_sql } = require("../models/customer");
const { Cart } = require("../models/cart");

const { Order } = require('../models/order');
const { Return } = require('../models/return');
const { or } = require("sequelize");
const {CartItem } = require('../models/cart');

const connection = require("../mysqldb");

exports.getAllOrders = async (req, res) => {
  const { email } = req.body;
  var searchquery = `SELECT im.item_model_name,mvt.variation_type,inv.variation_value, ci.quantity, ci.price, s.seller_organisation_name, o.order_id, o.delivery_status,o.return_status
  FROM Items i
  INNER JOIN ItemModels im ON i.item_id = im.item_id
  INNER JOIN ModelVariationTypes mvt ON im.item_model_id = mvt.item_model_id
  INNER JOIN ItemModelVariants imv ON mvt.variation_type_id = imv.variation_type_id
  INNER JOIN Inventory inv ON imv.product_id = inv.product_id
  INNER JOIN Sellers s ON inv.seller_id = s.seller_id
  INNER JOIN CartItems ci ON inv.inventory_item_id = ci.inventory_item_id
  INNER JOIN Orders o ON ci.cart_item_id = o.cart_item_id
  WHERE o.customer_email = ?;
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
  const { name, gender, email, password, mobile_number, address } = req.body;

  try {
    // Check if Customer with the same email already exists
    const user = await Customer.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Customer with the same email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Customer in MongoDB
    const newCustomer = new Customer({
      email: email,
      password: hashedPassword,
    });
    await newCustomer.save();

    // Create new Customer in SQL
    const customer = await Customer_sql.create({
      name,
      gender,
      email,
      mobile_number,
      address,
    });
    const cart = await Cart.create({
      customer_id: customer.customer_id,
    });
    console.log(customer);
    console.log(cart);
    res.status(201).json({ message: "Customer created successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find Customer with the given email
    cust = await Customer.findOne({ email });
    if (!cust) {
      return res
        .status(400)
        .json({
          message: "Invalid email id. Please Register before you login",
        });
    } else {
      return res.status(200).json({ message: "Login successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Function to update the delivery status of an order to 'delivered'
exports.updateDeliveryStatus = async (req, res) => {
  const { order_id, otp,email } = req.body;
  try {
    // Check if the OTP matches with the OTP of the given order ID
    const order = await Order.findOne({ where: { order_id } });
    if (!order) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    if(order.customer_email!=email){
      return res.status(400).json({ message: 'Invalid order ID for customer' });
    }
    if(order.otp !=otp){
      return res.status(400).json({message: 'Incorrect OTP'});
    }
    // Update the delivery status of the order to 'delivered'
    await order.update({ delivery_status: 'Delivered' });
    return res.status(200).json({ message: 'Delivery status updated to delivered' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating delivery status' });
  }
};

// module.exports = { updateDeliveryStatus };




exports.requestReturn = async(req, res) =>{
  const { order_id, return_reason, email } = req.body;

  try {
    // Check if the order exists and belongs to the customer
    const order = await Order.findOne({ where: { order_id: order_id, customer_email: email } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or does not belong to customer' });
    }
    console.log(order)

    // Create a return record for the order
    const returnRecord = await Return.create({
      order_id,
      return_reason,
    });
    // Update the order status to 'return_requested'
    await order.update({ return_status: 'Return requested' });
    console.log('Updated');
    return res.status(201).json(returnRecord);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}




exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
