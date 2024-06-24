'use strict';
const express = require('express');
const router = express.Router();
const {GetSingleClassAdmitCardStructure,CreateAdmitCardStructure,DeleteAdmitCardStructure,ChangeAdmitCardPublishStatus} = require('../controllers/admit-card-structure');


router.get('/admin/:id/class/:class',GetSingleClassAdmitCardStructure);
router.post('/',CreateAdmitCardStructure);
router.delete('/:id',DeleteAdmitCardStructure);
router.put('/admitcard-publish-status/:id', ChangeAdmitCardPublishStatus);

module.exports = router;