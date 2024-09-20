const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// Register user
router.post('/register', sellerController.register);

// Login user
router.post('/login', sellerController.login);
router.post('/acceptreturn', sellerController.acceptReturn);
router.post('/rejectreturn',sellerController.rejectReturn);
router.post('/dashboard',sellerController.salesDashboard);
router.post('/inventory',sellerController.sellersInventory);

module.exports = router;
