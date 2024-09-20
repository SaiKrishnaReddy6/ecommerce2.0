const express = require('express');
const { addingProductToInventory, updateProductInInventory, deleteProductFromInventory } = require('../controllers/inventoryController');

const router = express.Router();

router.post('/add', addingProductToInventory);
router.post('/update',updateProductInInventory);
router.post('/delete',deleteProductFromInventory);

module.exports = router;
