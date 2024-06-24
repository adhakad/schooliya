'use strict';
const mongoose = require('mongoose');
const FeesModel = mongoose.model('fees-structure', {
  adminId: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: Number,
    required: true,
    trim: true,
  },
  admissionFees: {
    type: Number,
    required: true,
    trim: true,
  },
  totalFees: {
    type: Number,
    required: true,
    trim: true,
  },
  feesType: {},

});

module.exports = FeesModel;