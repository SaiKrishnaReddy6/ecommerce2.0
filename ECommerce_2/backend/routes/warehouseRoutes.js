const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

// Register warehouse owner
router.post('/', warehouseController.register);

// Login warehouse owner
router.post('/login',  warehouseController.login);
router.post('/updatestatus',warehouseController.updateDeliveryStatus);

module.exports = router;
