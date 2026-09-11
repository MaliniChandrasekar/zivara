const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, trim: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  garment: { type: String, required: true, trim: true },
  designNotes: String,
  size: { type: String, trim: true },
  quantity: { type: Number, min: 1, default: 1 },
  fabric: String,
  color: String,
  alterationNotes: String,
  dueDate: { type: Date, required: true },
  amount: { type: Number, min: 0, default: 0 },
  advancePaid: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['New', 'Cutting', 'Stitching', 'Trial', 'Ready', 'Delivered', 'Cancelled'], default: 'New' },
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })
module.exports = mongoose.model('Order', orderSchema)
