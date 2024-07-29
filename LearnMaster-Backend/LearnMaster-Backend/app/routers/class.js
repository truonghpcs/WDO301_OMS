const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
// Routes for class
const middleware = require('../utils/middleware');
router.get('/mentor/:id', classController.getClassByMentorID);
router.get('/user/:id', classController.getClassByUserID);

module.exports = router;