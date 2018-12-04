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
      let error = new Error("invalid mime type");
      if(isValid){
        error = null;
      }
      cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null,name+'-'+Date.now()+'.' +ext);
    }
  });


// add admin route to all items
router.get('/all',verifyToken,itemController.getAllItems);

router.post('/create',verifyToken,multer({storage: storage}).single("image"),itemController.post);
router.get('/',verifyToken,itemController.getAllUserItems);
router.put('/:itemId',verifyToken,itemController.updateById);
router.delete('/:itemId',verifyToken,itemController.deleteById);

module.exports = router;
