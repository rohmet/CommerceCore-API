const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orders.controller.js');
const { protect, authorize } = require('../middleware/auth.middleware.js');

// Rute untuk membuat order baru
router.route('/').post(protect, createOrder);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/').get(protect, authorize('admin'), getAllOrders);
router.route('/update-status').put(protect, authorize('admin'), updateOrderStatus);

// export router 
module.exports = router;