'use strict';
const express = require('express');
const router = express.Router();
const {GetNotificationPagination,countNotification,GetAllNotification,GetSingleNotification,CreateNotification,UpdateNotification,DeleteNotification} = require('../controllers/notification');

router.get('/notification-count',countNotification);
router.get('/:id',GetAllNotification);
// router.get('/:id',GetSingleNotification);
router.post('/notification-pagination',GetNotificationPagination);
router.post('/',CreateNotification);
router.put('/:id',UpdateNotification);
router.delete('/:id',DeleteNotification);



module.exports = router;