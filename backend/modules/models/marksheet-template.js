'use strict';
const mongoose = require('mongoose');
const MarksheetTemplateModel = mongoose.model('marksheet-template', {
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
    stream: {
        type: String,
        required: true,
        trim: true,
    },
    templateName: {
        type: String,
        required: true,
        trim: true,
    }
});

module.exports = MarksheetTemplateModel;