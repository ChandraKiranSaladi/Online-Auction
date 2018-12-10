const scheduleController = require('../controllers/scheduleController');
const express = require('express');
const verifyToken = require('../auth/VerifyToken');
const router = express.Router();

router.get('/getCurrent', scheduleController.getCurrentAuctionItem);

router.get('/getAll', verifyToken, scheduleController.getAll);
router.get('/slots/:date', verifyToken, scheduleController.getAvailableSlots);
router.post('/create', verifyToken, scheduleController.create);
router.get('/:itemId', verifyToken, scheduleController.getById);
router.put('/:itemId', verifyToken, scheduleController.updateById);
router.delete('/:itemId', verifyToken, scheduleController.deleteById);

module.exports = router;