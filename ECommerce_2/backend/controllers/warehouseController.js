const bcrypt = require("bcrypt");
const { Warehouse, Warehouse_sql } = require("../models/warehouse");
const {Order} = require('../models/order');

exports.register = async (req, res) => {
  const { warehouse_name, email, password, address, owner_name } = req.body;
  console.log(owner_name);
  const user = await Warehouse.findOne({ email: email });
  console.log(user);

  try {
    // Check if Warehouse with the same email already exists
    if (user) {
      return res
        .status(400)
        .json({ message: "Warehouse with the same email already exists" });
    }
    console.log("here");
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("here2");

    // Create new Warehouse in MongoDB
    const newWarehouse = new Warehouse({
      email: email,
      password: hashedPassword,
    });

    console.log(newWarehouse);
    await newWarehouse.save();

    // Create new Warehouse in SQL
    const ware = await Warehouse_sql.create({
      warehouse_name,
      email,
      address,
      owner_name,
    });
    console.log(ware);
    res.status(201).json({ message: "Warehouse created successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


exports.updateDeliveryStatus = async (req, res) => {
  const { order_id, email} = req.body;
  const warehouse = await Warehouse_sql.findOne({where:{email}})
  const warehouse_name = warehouse.warehouse_name;
  try {
    // Find the order with the given ID
    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the delivery status to "Reached at first warehouse"
    order.delivery_status = 'Reached '+ warehouse_name;
    await order.save();

    return res.status(200).json({ message: 'Delivery status updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find Warehouse with the given email
  Warehouse.findOne({ email: email })
    .then((user1) => {
      if (!user1) {
        //console.log(email);
        return res.status(400).json({ message: "Invalid email or password" });
      }
      // Compare password
      return user1.comparePassword(password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: err });
        }

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({ message: "Login successful" });
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
