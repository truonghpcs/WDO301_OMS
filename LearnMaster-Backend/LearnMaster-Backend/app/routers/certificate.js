const express = require('express');
const router = express.Router();
const middleware = require('../utils/middleware');
const certificateController = require('../controllers/certificateController');

// Routes for courses
router.get('/list', certificateController.getAllCertificate);
router.get('/detail/:id', certificateController.getCertificateById);
router.post('/list-id', certificateController.getCertificateByListId);
router.post('/new',  certificateController.createCertificate);

module.exports = router;
