'use strict';
const mongoose = require('mongoose');
const ExamResultModel = mongoose.model('exam-result', {
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
  stream: {
    type: String,
    required: true,
    trim: true,
  },
  resultDetail:{},
});

module.exports = ExamResultModel;