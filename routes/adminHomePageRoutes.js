const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminHomePageController');

// API endpoint for creating an item
router.post('/item', adminController.createItem);

// API endpoint for updating an item
router.put('/item/:id', adminController.updateItem);

// API endpoint for deleting an item
router.delete('/item/:id', adminController.deleteItem);

router.get('/item', adminController.getAllItems);

module.exports = router;


