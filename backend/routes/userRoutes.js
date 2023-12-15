const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


router.post('/register', userController.register);

router.post('/authentication', userController.authentication);

router.post('/login', userController.login);

router.post('/registration-confirm', userController.registrationConfirm);

router.post('/change', userController.change);

// router.post('/forgot-password', userController.forgotPassword);

router.post('/delete', userController.delete);


module.exports = router;
