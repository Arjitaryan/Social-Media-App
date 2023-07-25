const passport= require('passport');

const LocalStrategy= require('passport-local').Strategy;

const User= require('../models/user');


//authentication using passport
passport.use(new LocalStrategy({
       usernameField: 'email',    //this is the property defined so that by which property, user will be find by
       passReqToCallback: true     //this will allow to pass the req parameter in the callback function
    },
    function(req, email, password, done){
        User.findOne({email: email})
        .then((user)=>{
            if(!user || user.password != password)
            {
                // console.log("Invalid Username / Password");
                req.flash('error', 'Invalid Username / Password');
                return done(null, false);
            }

            return done(null, user);
        })
        .catch((err)=> {
            // console.log("Error in finding user --> Passport");
            req.flash('error', err);
            return done(err);
        })
    }
));


//serializing the user to decide which key is to  be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


//deserializing the user form the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id)
    .then((user)=>{
        return done(null, user);
    })
    .catch((err)=>{
        console.log("Error in finding user --> Passport");
        return done(err);
    })
});


//check if the user is authenticated
passport.checkAuthentication= function(req, res, next){
    //if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in')
};

passport.setAuthenticatedUser= function(req, res, next){

    if(req.isAuthenticated())
    {
        //req.user contains the current signed in user from the session cookie and
        //we are just sending this to the locals for the views
        res.locals.user= req.user;
    }

    next();
};

module.exports= passport;