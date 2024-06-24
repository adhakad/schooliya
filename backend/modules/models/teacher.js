'use strict';
const mongoose = require('mongoose');

const TeacherModel = mongoose.model('teacher', {
    adminId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    teacherUserId: {
        type: Number,
        required: true,
        trim: true,
    },
    otp: {
        type: Number,
        required: true,
        trim: true,
    },
    education: {
        type: String,
        required: true,
        trim: true,
    },
    resultPermission: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        classes: {
            type: [Number],
            required: true,
            default: [0]
        }
    },
    studentPermission: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        classes: {
            type: [Number],
            required: true,
            default: [0]
        }
    },
    admissionPermission: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        classes: {
            type: [Number],
            required: true,
            default: [0]
        }
    },
    admitCardPermission: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        classes: {
            type: [Number],
            required: true,
            default: [0]
        }
    },
    feeCollectionPermission: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        classes: {
            type: [Number],
            required: true,
            default: [0]
        }
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ['Active', 'Inactive'],
        default: 'Inactive',
    }
});

module.exports = TeacherModel;