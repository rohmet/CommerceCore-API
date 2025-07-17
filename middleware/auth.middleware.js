const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/users.model.js');

// Middleware untuk memeriksa apakah pengguna sudah terautentikasi
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Cek apakah token ada di header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Temukan pengguna berdasarkan ID yang ada di token
      req.user = await User.findById(decoded.id).select('-password'); // Jangan kirim password

      next(); // Lanjutkan ke middleware berikutnya atau route handler
    } catch (error) {
      res.status(401);
      throw new Error('Tidak terautentikasi, token tidak valid');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Tidak terautentikasi, token tidak ditemukan');
  }

});