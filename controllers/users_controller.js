const User= require('../models/user');
const fs= require('fs');
const path= require('path');
const ResetPassword= require('../models/resetpassword');
const crypto= require('crypto');

const resetPasswordMailer= require('../mailers/reset_password_mailer');

module.exports.profile= function(req, res){
    User.findById(req.params.id)
    .then((user)=> {

        return res.render('user_profile', {
            title: "User Profile Page",
            profile_user: user
        });

    })
    .catch((err)=> {
        console.log("Error in getting to the profile page", err);
        return;
    })

};

module.exports.update= async function(req, res){
    // if(req.user.id == req.params.id)
    // {
    //     User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email})
    //     .then((user)=> {

    //         req.flash('success', 'Profile Updated Successfully');
    //         return res.redirect('back');
    //     })
    //     .catch((err)=> {

    //         req.flash('error', 'Error in updating the profile');
    //         return res.redirect('back');
    //     })
    // }
    // else
    // {
    //     req.flash('error', 'Unauthorized');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id==req.params.id)
    {
        try{
            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req, res, async function(err){
                if(err)
                {
                    console.log('*****Multer Error ', err);
                }
                
                let findUser= await User.findOne({email: req.body.email});

                if(findUser && findUser.id != req.user.id)
                {
                    req.flash('error', "This email already exists");
                    return res.redirect('back');
                }

                

                user.name= req.body.name;
                user.email= req.body.email;

                if(req.file){

                    if(user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar)))
                    {
                        //this will delete the previous image from the upload file
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //this is saving the path of the uploadedd file into the avatar field in the user
                    user.avatar= User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Profile Updated Successfully');
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else
    {
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}


module.exports.signUp= function(req, res){

    if(req.isAuthenticated())
    {
        return res.redirect('back');
    }

    return res.render('user_sign_up', {
        title: "Sign Up Page"
    });
};


module.exports.signIn= function(req, res){

    if(req.isAuthenticated())
    {
        return res.redirect('back');
    }

    return res.render('user_sign_in', {
        title: "Sign In Page"
    });
};


//get the sign up data
module.exports.create= function(req, res){
    
    // if password does not matches the confirm password
    if(req.body.password!=req.body.confirm_password)
    {
        req.flash('error', 'Password in both fields did not match');
        return res.redirect('back');
    }

    //check if email id is already registered
    User.findOne({email: req.body.email})
    .then((user)=> {
        if(!user)
        {
            //Create new user
            User.create(req.body)
            .then((newUser)=> {
                console.log("**********A New User Signed Up**********");
                req.flash('success', 'Signed Up Successfully');
                return res.redirect('/users/sign-in');
            })
        }
        else
        {
            req.flash('error', 'This email is already registered');
            return res.redirect('back');
        }
    })
    .catch((err)=> {
        req.flash('error', err);
        console.log("Error in finding the user in signing up");
        return;
    })
};




//sign in and create a session
module.exports.createSession= function(req, res){

    req.flash('success', 'Logged In Successfully');

    //to redirect to home page on signing in
    // return res.redirect('/');

    //to redirect to user profile page on signing in
    return res.redirect('/users/profile/' + req.user.id);
};



//this will destroy the session
module.exports.signOut= function(req, res){
    
    
    //this function is given by passport js
    req.logout(function(err){
        if(err)
        {
            req.flash('error', 'Error in logging out from the session');
            console.log("Error in logging out from the session");
            return next(err);
        }
        
        req.flash('success', 'You have logged Out');
        return res.redirect('/users/sign-in');
    });    
};

module.exports.renderConfirmEmail= function(req, res){
    // return res.redirect('back');
    return res.render('confirm_email', {
        title: "Confirm Email"
    });
};

module.exports.confirmEmail= async function(req, res){
    // return res.redirect('back');
    try{
        let user= await User.findOne({email: req.body.email});
        let newToken= crypto.randomBytes(8).toString('hex');

        if(user)
        {
            let resetPassword= await ResetPassword.create({
                user: user,
                accessToken: newToken,
            });

            resetPasswordMailer.resetPasswordMail(resetPassword, req.body.email);
        
            req.flash('info', "Check your mail box to reset password");
            return res.redirect('/users/sign-in');
        }
        else
        {
            req.flash('error', "This email is not registered");
            return res.redirect('back');
        }

    }catch(err){
        console.log("error in confirming the email to reset password", err);
        return res.redirect('back');
    }
};

module.exports.checkValidSession= async function(req, res){
    try{
        let resetPassword= await ResetPassword.findById(req.params.id);
        if(!resetPassword || resetPassword.isValid==false)
        {
            req.flash('error', "This session is expired");
            return res.redirect('/users/sign-in');
        }
        else
        {

            return res.render('reset_password', {
                resetId: resetPassword._id,
                title: "Reset Password"
            });
        }
    }catch(err){
        console.log("Error in session for reset password", err);
        return res.redirect('/users/sign-in');
    }
};

module.exports.resetPassword= async function(req, res){

    try{
        
        if(req.body.password!=req.body.confirm_password)
        {
            req.flash('error', 'Password in both fields did not match');
            return res.redirect('back');
        }
    
        
        let resetPassword= await ResetPassword.findById(req.params.id);
        resetPassword.isValid= false;
        resetPassword.save();
        
        let user= await User.findById(resetPassword.user);
        user.password= req.body.password;
        user.save();

        req.flash('success', "Password is updated successfully!");
        return res.redirect('/users/sign-in');
    }catch(err)
    {
        console.log("Error in updating the password", err);
        return res.redirect('/users/sign-in');
    }
}

