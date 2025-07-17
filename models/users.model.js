const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema ({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true, // Setiap email harus unik
    match: [/.+\@.+\..+/, 'Format email tidak valid'],
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', usersSchema);