'use strict';
const express = require('express');
const router = express.Router();
const { GetAllStudentByClass, countStudent, GetSingleStudent, CreateStudent, CreateBulkStudentRecord, UpdateStudent, ChangeStatus, DeleteStudent, GetStudentPaginationByClass, GetStudentPaginationByAdmission, StudentClassPromote, GetStudentPaginationByAdmissionAndClass } = require('../controllers/student');

router.get('/student-count', countStudent);
router.get('/admin/:id/student/:class', GetAllStudentByClass);
router.post('/student-pagination', GetStudentPaginationByClass);
router.post('/student-admission-pagination', GetStudentPaginationByAdmission);
router.post('/student-admission-pagination/class', GetStudentPaginationByAdmissionAndClass);
// router.post('/student-admission-enquiry-pagination', GetStudentAdmissionEnquiryPagination);
router.get('/:id', GetSingleStudent);
router.post('/', CreateStudent);
// router.post('/online-admission', CreateStudentAdmissionEnquiry);
router.post('/bulk-student-record', CreateBulkStudentRecord);
router.put('/:id', UpdateStudent);
router.put('/class-promote/:id', StudentClassPromote);
router.put('/status/:id', ChangeStatus);
router.delete('/:id', DeleteStudent);
// router.delete('/admission-enquiry/:id', DeleteAdmissionEnquiry);


module.exports = router;