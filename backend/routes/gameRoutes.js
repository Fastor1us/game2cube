const express = require('express');
const router = express.Router();

const userController = require('../controllers/gameController');

// get или post?
// router.get('/user', userController.add);

router.post('/add', userController.add);




module.exports = router;
