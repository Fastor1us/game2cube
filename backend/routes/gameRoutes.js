const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');


router.post('/add', gameController.add);

router.get('/get', gameController.get);


module.exports = router;
