const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add item to cart
router.post('/add', cartController.addToCart);

// Update item quantity in cart
router.post('/update', cartController.updateCartItemQuantity);

// Delete item from cart
router.post('/delete', cartController.deleteCartItem);

module.exports = router;
