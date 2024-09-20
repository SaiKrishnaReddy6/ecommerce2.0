const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Route for creating a new item
router.post('/', itemController.createItem);

// Route for getting all items
router.get('/', itemController.getItems);

// Route for getting a single item by ID
// router.get('/:id', itemController.getItemById);

// Route for updating an existing item
router.put('/update', itemController.updateItem);
// router.post('/deleteItem',itemController.deleteItem);
// Route for deleting an existing item
router.post('/delete', itemController.deleteItemByProductId);

module.exports = router;
