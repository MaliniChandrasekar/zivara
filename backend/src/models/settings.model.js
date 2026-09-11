const mongoose = require('mongoose')
const settingsSchema = new mongoose.Schema({
  address: { type: String, default: 'No. 41 K, Salai Pudur, Bypass Rd, Thikathir, Madurai, Tamil Nadu 625018' },
  phone: { type: String, default: '+91 82203 64840' },
  hours: { type: String, default: 'Mon–Sat · 10:00 AM–8:00 PM' },
  adminPasswordHash: String,
}, { timestamps: true })
module.exports = mongoose.model('Settings', settingsSchema)
