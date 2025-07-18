const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orders.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// Rute untuk membuat order baru
router.route('/').post(protect, createOrder);
router.route('/my-orders').get(protect, getAllOrders);

// export router 
module.exports = router;