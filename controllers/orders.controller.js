const Post = require('../models/products.model.js');
const asyncHandler = require('express-async-handler');
const Order = require('../models/orders.model.js');

// Create - buat order baru
exports.createOrder = asyncHandler(async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0 ) {
      res.status(400);
      throw new Error('Semua field wajib diisi dengan benar');
    }

    // Cek apakah user yang membuat order adalah pembeli
    if (req.user._id.toString() !== req.body.buyer.toString()) {
      res.status(403);
      throw new Error('Anda tidak memiliki izin untuk membuat order ini');
    }

    // ambil data produk
    const productIds = products.map(p => p.productId);
    const productInDB = await Post.find({ _id: { $in: productIds } });

    let totalAmount = 0;

    for (const item of products) {
      // Validasi apakah produk ada di database
      const productDetail = productInDB.find(p => p._id.toString() === item.productId);
      
      // Jika produk tidak ditemukan, kirim error
      if (!productDetail) {
        res.status(404);
        throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
      }

      // Validasi jumlah produk
      if (productDetail.stock < item.quantity) {
        res.status(400);
        throw new Error(`Stok produk ${productDetail.name} tidak cukup`);
      }

      // hitung total harga
      totalAmount += productDetail.price * item.quantity;
    }
    // Buat order baru
    const newOrder = new Order({
      buyer: req.user._id,
      products,
      totalAmount
    });
    
    await newOrder.save();

    // Update stok produk
    for (const item of products) {
      await Post.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    res.status(201).json(newOrder);

  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat order', error: error.message });
  }
});

// Read - ambil semua order pengguna
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('products.productId', 'name price stock')
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error('Tidak ada order ditemukan');
  }
  
  res.status(200).json(orders);

});

// Read - ambil order khusus admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('products.productId', 'name price stock')
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error('Tidak ada order ditemukan');
  }

  res.status(200).json(orders);

});

// Update - update status order (hanya untuk admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    res.status(400);
    throw new Error('Semua field wajib diisi dengan benar');
  }

  // Validasi status
  const validStatuses = ['pending', 'paid', 'shipped', 'delivered'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Status tidak valid');
  }

  // Temukan order berdasarkan ID
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order tidak ditemukan');
  }

  // Update status order
  order.status = status;
  await order.save();

  res.status(200).json({ message: 'Status order berhasil diperbarui', order });
});