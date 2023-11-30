const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


router.post('/register', userController.register);

router.post('/authentication', userController.authentication);

// router.post('/logout', userController.logout);

router.post('/login', userController.login);

router.post('/registrationConfirm', userController.registrationConfirm);


module.exports = router;
