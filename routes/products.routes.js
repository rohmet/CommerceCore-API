const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getAllProducts, 
  getProductById,
  updateProduct
} = require('../controllers/products.controllers.js');

router.route('/').post(createProduct);
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/:id').put(updateProduct);

module.exports = router;