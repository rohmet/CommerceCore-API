const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema ({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
  },
  description: {
    type: String,
    required: [true, 'Deskripsi wajib diisi'],
  },
  price: {
    type: Number,
    required: [true, 'Harga wajib diisi'],
  },
  stock: {
    type: Number,
    required: [true, 'Stok wajib diisi'],
    default: 0
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('Products', productsSchema);