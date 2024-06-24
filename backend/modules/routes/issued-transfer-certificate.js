'use strict';
const express = require('express');
const router = express.Router();
const { CreateIssuedTransferCertificate,GetIssuedTransferCertificatePagination, DeleteIssuedTransferCertificate} = require('../controllers/issued-transfer-certificate');

router.post('/issued-transfer-certificate-pagination', GetIssuedTransferCertificatePagination);
router.post('/', CreateIssuedTransferCertificate);
router.delete('/:id', DeleteIssuedTransferCertificate);


module.exports = router;