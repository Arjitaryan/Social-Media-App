const express= require('express');
const router= express.Router();
const passport= require('passport');

const commentsControoler= require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commentsControoler.create);
router.get('/destroy/:id', passport.checkAuthentication, commentsControoler.destroy);

module.exports= router;