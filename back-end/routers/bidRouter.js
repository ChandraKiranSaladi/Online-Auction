const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const verifyToken = require('../auth/VerifyToken');

router.post('/create',verifyToken,bidController.create);
// router.get('/get')

module.exports = router;