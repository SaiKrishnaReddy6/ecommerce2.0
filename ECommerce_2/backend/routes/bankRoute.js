const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

// Add a new bank
router.post('/', bankController.addBank);

// Update an existing bank by ID
router.post('/update', bankController.updateBank);

// Delete a bank by ID
//router.post('/delete', bankController.deleteBank);

// Get a list of all banks
router.get('/', bankController.getAllBanks);

module.exports = router;
