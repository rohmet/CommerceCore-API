const Post = require('../models/products.model.js');
const asyncHandler = require('express-async-handler');

// Create - buat produk baru
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !description || !price || stock === undefined) {
    res.status(400);
    throw new Error('Semua field wajib diisi');
  }
  const newProduct = await Post.create({ name, description, price, stock });
  res.status(201).json(newProduct);
});

// @desc    Get all products
// @route   GET /api/products
// exports.getProducts = asyncHandler(async (req, res) => {

// })