'use strict';
const mongoose = require('mongoose');
const MarksheetTemplateStructureModel = mongoose.model('marksheet-template-structure', {
    templateName: {
        type: String,
        required: true,
        trim: true
    },
    examStructure: {},
    
});

module.exports = MarksheetTemplateStructureModel;