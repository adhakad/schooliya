'use strict';
const mongoose = require('mongoose');

const StudentModel = mongoose.model('student', {
    adminId: {
        type: String,
        required: true,
        trim: true
    },
    session: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    class: {
        type: Number,
        required: true,
        trim: true
    },
    admissionClass: {
        type: Number,
        required: true,
        trim: true
    },
    admissionNo: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    rollNumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    admissionType: {
        type: String,
        required: true,
        trim: true
    },
    stream: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: String,
        required: true,
        trim: true
    },
    doa: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    religion: {
        type: String,
        required: true,
        trim: true
    },
    nationality: {
        type: String,
        required: true,
        trim: true
    },
    aadharNumber: {
        type: Number,
        trim: true,
        required: true,
        unique: true,

    },
    samagraId: {
        type: Number,
        trim: true,
        required: true,
        unique: true,

    },
    contact: {
        type: Number,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    lastSchool: {
        type: String,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    fatherQualification: {
        type: String,
        required: true,
        trim: true
    },
    fatherOccupation: {
        type: String,
        required: true,
        trim: true
    },
    fatherContact: {
        type: Number,
        required: true,
        trim: true
    },
    fatherAnnualIncome: {
        type: String,
        required: true,
        trim: true
    },
    motherName: {
        type: String,
        required: true,
        trim: true
    },
    motherQualification: {
        type: String,
        required: true,
        trim: true
    },
    motherOccupation: {
        type: String,
        required: true,
        trim: true
    },
    motherContact: {
        type: Number,
        required: true,
        trim: true
    },
    motherAnnualIncome: {
        type: String,
        required: true,
        trim: true
    },
    discountAmountInFees: {
        type: Number,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    createdBy: {
        type: String,
        required: true,
        trim: true,
    },
});
module.exports = StudentModel;