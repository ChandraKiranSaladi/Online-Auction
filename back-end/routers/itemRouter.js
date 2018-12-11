const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const multer = require('multer');
const verifyToken = require('../auth/VerifyToken');
const MIME_TYPE_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    console.log("mime-type: " + file.mimetype);
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('/itemsByDate/:date', itemController.getItemsByDate);

router.get('/currentBid/:itemId', itemController.getCurrentBidByItemId);

// add admin route to all items
router.get('/all',itemController.getAllItems);

router.post('/create', verifyToken, multer({ storage: storage }).single("image"), itemController.post);
router.get('/', verifyToken, itemController.getAllUserItems);
router.put('/:itemId', verifyToken, multer({ storage: storage }).single("image"), itemController.updateById);
router.get('/:itemId', verifyToken, itemController.getById);
router.delete('/:itemId', verifyToken, itemController.deleteById);

module.exports = router;
