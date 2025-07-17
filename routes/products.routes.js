const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getAllProducts, 
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controllers.js');
const { protect } = require('../middleware/auth.middleware.js');

router.route('/').post(protect, createProduct);
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/:id').put(protect, updateProduct);
router.route('/:id').delete(protect, deleteProduct);

module.exports = router;