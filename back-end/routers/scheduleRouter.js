const scheduleController = require('../controllers/scheduleController');
const express = require('express');

const router = express.Router();

router.get('/getAll',scheduleController.getAll);

router.post('/create',scheduleController.create);
router.get('/:itemId',scheduleController.getById);
router.put('/:itemId',scheduleController.updateById);
router.delete('/:itemId',scheduleController.deleteById);

module.exports = router;