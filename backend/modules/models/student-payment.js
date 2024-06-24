'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: Number,
    required: true,
    trim: true
  },
  feesInstallment: {
    type: String,
    required: true,
    trim: true
  },
  feesAmount: {
    type: Number,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    trim: true,
    default: 'pending',
  },
});

module.exports = mongoose.model('Payment', paymentSchema);