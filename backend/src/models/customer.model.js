const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
    measurements: {
      size: String,
      bust: Number,
      underBust: Number,
      waist: Number,
      hip: Number,
      shoulder: Number,
      armhole: Number,
      neckFront: Number,
      neckBack: Number,
      length: Number,
      sleeve: Number,
      sleeveRound: Number,
      unit: { type: String, default: "in" },
    },
    tags: [String],
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
