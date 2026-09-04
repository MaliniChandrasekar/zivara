const mongoose = require('mongoose')
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  preferredDate: Date,
  message: { type: String, trim: true },
  status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Closed'], default: 'New' },
  source: { type: String, default: 'Website' },
}, { timestamps: true })
module.exports = mongoose.model('Enquiry', enquirySchema)
