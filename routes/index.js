const express= require('express');
const router= express.Router();
const passport= require('passport');
const homeController= require('../controllers/home_controller');


router.get('/', passport.checkAuthentication, homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/friend', require('./friend'));


router.use('/api', require('./api'))

//for any further routes, access from here
//routr.use('/routerName', require('./rouyerFile'));


module.exports= router;