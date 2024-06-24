'use strict';
const mongoose = require('mongoose');

const NotificationModel = mongoose.model('notification', {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ["Student", "Teacher", "Public"],
    },
    class: {
        type: Number,
        trim: true,
    },
    date: {
        type: Number,
        required: true,
        trim: true,
    },


});

module.exports = NotificationModel;
