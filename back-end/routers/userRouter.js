const userController = require('../controllers/userController');

const express = require('express');
const router = express.Router();

// router.get('/getAll'.userController.admin_getAllUsers);

router.post('/register',userController.create);
router.post('/login',userController.login);
router.post('/logout',userController.logout);
router.get('/profile',userController.profile);
router.post('/passwordreset',userController.passwordReset);
router.put('/update',userController.update);

router.get('/:userID',userController.getById); 
router.put('/:userID',userController.updateById); 
router.delete('/:userID',userController.deleteById); 



module.exports = router;