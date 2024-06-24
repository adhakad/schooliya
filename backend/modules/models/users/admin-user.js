'use strict';
const mongoose = require('mongoose');

const AdminModel = mongoose.model('admin-users', {
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: Number,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        default: 'India',
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: Number,
        required: true,
        trim: true,
    },
    schoolName: {
        type: String,
        required: true,
        trim: true,
    },
    affiliationNumber: {
        type: String,
        required: true,
        trim: true,
    },
    schoolId: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    }
    // status: {
    //     type: String,
    //     trim: true,
    //     required: true,
    //     enum: ['Active', 'Inactive']
    // }
});

module.exports = AdminModel;