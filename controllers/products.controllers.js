const Post = require('../models/products.model.js');
const asyncHandler = require('express-async-handler');

// Create - buat produk baru
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !description || !price || stock === undefined) {
    res.status(400);
    throw new Error('Semua field wajib diisi');
  }
  const newProduct = await Post.create({ name, description, price, stock, user: req.user._id });
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

// Read - ambil produk berdasarkan ID
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Post.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Produk tidak ditemukan');
  }
  res.status(200).json(product);
});

// Update - update produk berdasarkan ID
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const product = await Post.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Produk tidak ditemukan');
  }

  // cek apakah user yang mengupdate adalah pemilik produk
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Anda tidak memiliki izin untuk mengupdate produk ini');
  }

  // Update field yang ada di body request
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock !== undefined ? stock : product.stock;

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

// Delete - hapus produk berdasarkan ID
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Post.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Produk tidak ditemukan');
  }

  // cek apakah user yang menghapus adalah pemilik produk
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Anda tidak memiliki izin untuk menghapus produk ini');
  }
  
  await product.deleteOne();
  res.status(200).json({ message: 'Produk berhasil dihapus' });
});