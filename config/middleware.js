module.exports.setFlash= function(req, res, next){
    res.locals.flash= {
        'success': req.flash('success'),
        'error': req.flash('error'),
        'alert': req.flash('alert'),
        'warning': req.flash('warning'),
        'info': req.flash('info')
    }

    next();
}