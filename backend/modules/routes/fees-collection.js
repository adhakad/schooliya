'use strict';
const express = require('express');
const router = express.Router();
const {GetSingleStudentFeesCollectionById,GetAllStudentFeesCollectionByClass,CreateFeesCollection,CreateAdmissionFeesCollection} = require('../controllers/fees-collection');


router.get('/student/:studentId',GetSingleStudentFeesCollectionById);
router.get('/admin/:id/class/:class',GetAllStudentFeesCollectionByClass);

router.post('/',CreateFeesCollection);
router.post('/admission-fees',CreateAdmissionFeesCollection);

module.exports = router;