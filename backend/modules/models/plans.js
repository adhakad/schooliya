'use strict';
const mongoose = require('mongoose');

const PlansModel = mongoose.model('plan', {
    plans: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
});

module.exports = PlansModel;