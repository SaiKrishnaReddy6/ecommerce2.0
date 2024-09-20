const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');

// Register user
router.post('/register', advertiserController.register);

// Login user
router.post('/login', advertiserController.login);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const advertiserController = require('../controllers/advertiserController');

// router.post('/', advertiserController.createAdvertiser);
// router.get('/:id', advertiserController.getAdvertiserById);
// router.put('/:id', advertiserController.updateAdvertiser);
// router.delete('/:id', advertiserController.deleteAdvertiser);

// module.exports = router;
