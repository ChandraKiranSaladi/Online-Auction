const userController = require('../controllers/userController');
const verifyToken = require('../auth/VerifyToken');
const checkAdmin = require('../auth/CheckAdmin');

const express = require('express');
const router = express.Router();

// router.get('/getAll', verifyToken, checkAdmin, userController.admin_getAllUsers);

router.post('/register', userController.create);
router.post('/login', userController.login);
router.post('/logout', verifyToken, userController.logout);
router.get('/profile', verifyToken, userController.profile); 
router.post('/passwordreset', userController.passwordReset);
router.put('/update', verifyToken, userController.update);

// This token is different from JWT
router.get('/reset/:token',userController.passwordResetGet);
router.post('/reset/:token',userController.passwordResetPost);

router.get('/:userID', verifyToken, userController.getById);
router.put('/:userID', verifyToken, userController.updateById);
router.delete('/:userID', verifyToken, userController.deleteById);

module.exports = router;