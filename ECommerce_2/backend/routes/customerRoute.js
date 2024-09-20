const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

const grievanceController = require("../controllers/grievanceController");
const search = require('../controllers/search');
const order = require('../controllers/orderController');
// Register user
router.post('/register', customerController.register);

// Login user
router.post('/login', customerController.login);
router.post('/search',search.searchItems);
router.post('/placeorder',order.placeOrder);
router.post('/otp',customerController.updateDeliveryStatus);
router.post('/requestreturn',customerController.requestReturn);
router.post('/filegrievance',grievanceController.fileGrievance);
router.post('/deletegrievance',grievanceController.deleteGrievance);
router.post('/myorders',customerController.getAllOrders);

module.exports = router;
