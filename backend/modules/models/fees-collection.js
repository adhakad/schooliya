'use strict';
const mongoose = require('mongoose');
const FeesCollectionModel = mongoose.model('fees-collection', {
  adminId: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true,
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
    default: 0
  },
  admissionFeesPayable: {
    type: Boolean,
    required: true,
    trim: true,
  },
  admissionFeesReceiptNo: {
    type: Number,
    required: true,
    trim: true,
    default: 0
  },
  admissionFeesPaymentDate: {
    type: String,
    required: true,
    trim: true,
    default: 'empty'
  },
  discountAmountInFees: {
    type: Number,
    required: true,
    trim: true,
  },
  totalFees: {
    type: Number,
    required: true,
    trim: true,
  },
  paidFees: {
    type: Number,
    required: true,
    trim: true,
  },
  dueFees: {
    type: Number,
    required: true,
    trim: true,
  },
  installment: {
    type: [Number],
    default: []
  },
  receipt: {
    type: [Number],
    default: []
  },
  paymentDate: {
    type: [String],
    default: []
  },
  createdBy: {
    type: [String],
    default: []
  }
});

module.exports = FeesCollectionModel;