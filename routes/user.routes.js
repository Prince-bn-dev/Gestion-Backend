const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const { protect ,authorizeRoles} = require('../middlewares/authMiddleware');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage }); 

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get("/verifyEmail/:emailToken",userController.verify);
router.post('/resendSmsCode', userController.resendSmsCode);
router.post('/verify-phone', userController.verifyPhoneCode);

router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPasswordWithSms', userController.resetPasswordWithSms);
router.put('/resetPassword/:resetToken', userController.resetPassword);
router.get('/profile', protect, userController.getProfile);
router.put('/password/update', protect, userController.updatePassword);

router.get('/chauffeurs',  userController.getChauffeurs);


router.post("/upload" ,upload.single('file'), uploadController.uploadProfil)



module.exports = router;
