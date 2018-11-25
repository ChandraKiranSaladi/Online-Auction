const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/',itemController.getAllItems);

router.post('/create',itemController.create);
router.get('/:itemId',itemController.getById);
router.put('/:itemId',itemController.updateById);
router.delete('/:itemId',itemController.deleteById);

module.exports = router;
