const express= require('express');
const router= express.Router();

const friendController= require('../controllers/friend_controller');

router.get('/add/:id', friendController.addFriend);
router.get('/remove/:id', friendController.removeFriend);

module.exports= router;