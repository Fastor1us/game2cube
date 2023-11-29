const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


router.get('/', userController.getUser);

router.get('/users', userController.getUsers);

router.post('/register', userController.registerUser);

router.post('/registrationConfirm', userController.registrationConfirm);


module.exports = router;
