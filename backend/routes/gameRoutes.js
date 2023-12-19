const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');


router.post('/add', gameController.add);

router.get('/get', gameController.get);

router.post('/toggle-like', gameController.toggleLike);

router.post('/delete', gameController.delete);

// router.post('/remove-like', gameController.removeLike);


module.exports = router;
