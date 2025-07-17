require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productsRoutes = require('./routes/products.routes.js');
const userRoutes = require('./routes/user.routes.js');
const ordersRoutes = require('./routes/orders.routes.js');

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware dasar
// Middleware untuk parsing body request JSON
app.use(express.json()); 

// 4. Koneksi ke MongoDB
// Proses koneksi ini bersifat asynchronous
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Berhasil terhubung ke MongoDB compass!');

    // 5. Jalankan server HANYA SETELAH koneksi database berhasil
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke MongoDB:', err.message);
    process.exit(1); // Keluar dari aplikasi jika tidak bisa terhubung ke DB
  });

// Rute sederhana untuk pengujian
app.get('/', (req, res) => {
  res.send('Selamat datang di commerce!');
});

// 6. Rute untuk produk
app.use('/api/products', productsRoutes);
// 7. Rute untuk pengguna
app.use('/api/users', userRoutes);
// 8. Rute untuk order
app.use('/api/orders', ordersRoutes);