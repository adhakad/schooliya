'use strict';
const mongoose = require('mongoose');

const OTPModel = mongoose.model('otp', {
    email: {
        type: String,
        required: true,
        trim: true,
      },
      secret: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15, // The document will be automatically deleted after 5 minutes of its creation time
      },
});

module.exports = OTPModel;