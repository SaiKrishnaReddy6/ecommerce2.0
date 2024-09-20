const { Op, QueryTypes } = require('sequelize');
const { ROUND } = require("sequelize");
const {Order} = require('../models/order');
const {CartItem} = require('../models/cart');
const { Warehouse,Warehouse_sql } = require('../models/warehouse');
const { Coupon } = require('../models/coupon');
const { AccountDetails } = require("../models/bank");
const { Inventory } = require('../models/inventory');
const { Seller_sql } = require('../models/seller');
const { Advertiser, Advertiser_sql } = require("../models/advertiser");


async function placeOrder(req, res) {
  try {
    const { customer_email, customer_amount_received, cart_item_id, coupon_code,bank_id,account_pin } = req.body;
    
    const cust_amount = parseFloat(customer_amount_received)
    // Find the cart item
    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) {
      return res.status(400).send({ error: 'Cart item not found' });
    }
    const total_price = cartItem.price;
    const inventory_item_id = cartItem.inventory_item_id;
    const inventoryItem = await Inventory.findByPk(inventory_item_id);
    if(!inventoryItem){
        return res.status(400).send({error: 'Inventory Item not found'});
    }
    if(inventoryItem.quantity < cartItem.quantity){
      return res.status(400).send({error: 'Out of stock (or) Insufficient stock'});
    }
    const seller_id = inventoryItem.seller_id;
    console.log(seller_id);
    const sellerItem = await Seller_sql.findOne({where:{seller_id}});    console.log(sellerItem)

    if(!sellerItem){
        return res.status(400).send({error: 'Seller not found'});
    }
    const seller_email = sellerItem.email;
    // Find the coupon
    const coupon = await Coupon.findOne({where:{coupon_code}});
    console.log(coupon);
    if (!coupon) {
      return res.status(400).send({ error: 'Coupon not found' });
    }
    const advertiser = await Advertiser_sql.findOne({where:{advertiser_id : coupon.advertiser_id}})
    const advertiser_amount_paid = coupon.discount_amount;
    const advertiser_amount = parseFloat(advertiser_amount_paid)
    // Find the warehouses
    const warehouses = await Warehouse_sql.findAll();

    // Generate a random OTP
    const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    console.log(cust_amount,advertiser_amount);
    const seller_amount = parseFloat((cust_amount + advertiser_amount) - 15.00);
    const platform_commission = 15.00;
//     const customerAmount = parseFloat(customer_amount_received);
// const advertiserAmount = parseFloat(advertiser_amount_paid);
// const seller_amount = ((customerAmount + advertiserAmount) * 0.99,2);
// const platform_commission = ROUND((customerAmount + advertiserAmount) * 0.01,2);

    console.log(platform_commission,seller_amount);

    // Update the account balances
    const customerAccount = await AccountDetails.findOne({ where: { accountholder_email: customer_email,bank_id:bank_id} });
    if (!customerAccount) {
      return res.status(400).send({ error: 'Customer account not found' });
    }
    if(customerAccount.account_pin!=account_pin){
      return res.status(400).send({error : 'Incorrect PIN'})
    }
    if(customerAccount.account_balance<total_price){
      return res.status(400).json({ msg : 'Insufficient account balance'});
    }
    await customerAccount.update({ account_balance: customerAccount.account_balance - customer_amount_received });

    const advertiserAccount = await AccountDetails.findOne({ where: { accountholder_email: advertiser.email } });
    if (!advertiserAccount) {
      return res.status(400).send({ error: 'Advertiser account not found' });
    }
    await advertiserAccount.update({ account_balance: advertiserAccount.account_balance - advertiser_amount_paid });

    const platformAccount = await AccountDetails.findOne({ where: { accountholder_email: 'platform@gmail.com' } });
    if (!platformAccount) {
      return res.status(400).send({ error: 'Platform account not found' });
    }
    const final_platform = parseFloat(platformAccount.account_balance + platform_commission)
    await platformAccount.update({ account_balance:  final_platform});

    // const inventoryItem = await cartItem.getInventoryItem();
    // if (!inventoryItem) {
    //   return res.status(400).send({ error: 'Inventory item not found' });
    // }
    // const seller = await inventoryItem.getSeller();
    // if (!seller) {
    //   return res.status(400).send({ error: 'Seller not found' });
    // }
    const sellerAccount = await AccountDetails.findOne({ where: { accountholder_email: seller_email } });
    if (!sellerAccount) {
      return res.status(400).send({ error: 'Seller account not found' });
    }
    await sellerAccount.update({ account_balance: sellerAccount.account_balance + seller_amount });
    const order = await Order.create({
      customer_email,
      customer_amount_received,
      advertiser_amount_paid,
      seller_amount,
      platform_commission,
      delivery_status: 'Shipped',
      return_status: 'NA',
      bank_id:bank_id,
      otp,
      coupon_id : coupon.coupon_id,
      cart_item_id,
      warehouse1_id: warehouses[0].warehouse_id,
      warehouse2_id: warehouses[1].warehouse_id
    });
    console.log(order);
    inventoryItem.update({quantity: inventoryItem.quantity-cartItem.quantity});
    return res.send({ message: 'Order placed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
}


module.exports = { placeOrder };
