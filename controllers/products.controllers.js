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

// Read - ambil semua produk
exports.getAllProducts = asyncHandler(async (req, res) => {
  //ambil data produk dengan pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Hitung total produk untuk pagination
  const totalProducts = await Post.countDocuments();

  // Ambil produk dengan pagination
  const products = await Post.find({})
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Kirim response dengan data produk
  res.status(200).json({
    products,
    page,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts
  });
})
