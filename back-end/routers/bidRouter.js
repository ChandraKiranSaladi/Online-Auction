const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const verifyToken = require('../auth/VerifyToken');

router.post('/create',verifyToken,bidController.create);
// router.get('/get')
router.get('/history/:itemId',verifyToken,bidController.getBidHistoryOfItem);

module.exports = router;