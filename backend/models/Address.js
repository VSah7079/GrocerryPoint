const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema); 