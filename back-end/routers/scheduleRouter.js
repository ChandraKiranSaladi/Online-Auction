const scheduleController = require('../controllers/scheduleController');
const express = require('express');

const router = express.Router();

router.get('/getAll',verifyToken,scheduleController.getAll);
router.get('/slots',verifyToken,scheduleController.getAvailableSlots);
router.post('/create',verifyToken, scheduleController.create);
router.get('/:itemId',verifyToken,scheduleController.getById);
router.put('/:itemId',verifyToken,scheduleController.updateById);
router.delete('/:itemId',verifyToken,scheduleController.deleteById);

module.exports = router;