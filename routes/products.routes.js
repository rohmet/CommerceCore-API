const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getAllProducts, 
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controllers.js');

router.route('/').post(createProduct);
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/:id').put(updateProduct);
router.route('/:id').delete(deleteProduct);

module.exports = router;