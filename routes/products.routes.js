const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/products.controllers.js');

router.route('/').post(createProduct);

