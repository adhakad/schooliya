'use strict';
const mongoose = require('mongoose');

const BannerModel = mongoose.model('banner', {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
});

module.exports = BannerModel;
