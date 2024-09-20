const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Route to add a new coupon for an advertiser
router.post('/add', couponController.addCoupon);

// Delete a bank by ID
router.post('/delete', couponController.deleteCoupon);

// Get a list of all banks
router.get('/', couponController.getAllCoupons);

module.exports = router;
