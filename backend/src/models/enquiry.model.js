const mongoose = require('mongoose')
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  service: { type: String, required: true, trim: true },
  preferredDate: Date,
  preferredTime: { type: String, trim: true },
  city: { type: String, trim: true },
  budget: { type: String, trim: true },
  referenceImageName: { type: String, trim: true },
  rating: { type: Number, min: 1, max: 5 },
  message: { type: String, trim: true },
  status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Closed'], default: 'New' },
  source: { type: String, default: 'Website' },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })
module.exports = mongoose.model('Enquiry', enquirySchema)
