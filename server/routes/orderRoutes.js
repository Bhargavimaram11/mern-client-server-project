const express = require('express');
const router = express.Router();
const { createOrder, getOrdersWithDetails } = require('../controllers/orderController');

// Route to create a new order
router.post('/orders', createOrder);

// Route to get all orders with product and user details
router.get('/orders', getOrdersWithDetails);

module.exports = router;
