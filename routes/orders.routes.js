const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orders.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// Rute untuk membuat order baru
router.route('/').post(protect, createOrder);

// export router 
module.exports = router;