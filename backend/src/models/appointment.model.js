const mongoose = require('mongoose')
const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Consultation', 'Measurement', 'Trial', 'Collection'], required: true },
  scheduledAt: { type: Date, required: true },
  notes: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'No show'], default: 'Scheduled' },
}, { timestamps: true })
module.exports = mongoose.model('Appointment', appointmentSchema)
