'use strict';
const mongoose = require('mongoose');

const ClassModel = mongoose.model('class', {
    class: {
        type: Number,
        required: true,
        trim: true,
    },
});

module.exports = ClassModel;
