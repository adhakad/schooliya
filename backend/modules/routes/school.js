'use strict';
const express = require('express');
const router = express.Router();
const {GetSingleSchoolNameLogo,GetSingleSchool,CreateSchool,UpdateSchool,DeleteSchool} = require('../controllers/school');

router.get('/name-logo',GetSingleSchoolNameLogo);
router.get('/:id',GetSingleSchool);
router.post('/',CreateSchool);
router.put('/:id',UpdateSchool);
router.delete('/:id',DeleteSchool);

module.exports = router;