const Post= require('../models/post');
const Comment= require("../models/comment");
const path= require('path');
const User= require("../models/user");     //for ajax
const Like= require('../models/like');

const fs= require('fs');

module.exports.create= async function(req, res){

    try{

        /*
        let post= await Post.create({
            content: req.body.content,
            user: req.user._id,
            //since we set the user to a User in request using setAuthenticated function
        })
        */

        Post.uploadedPhoto(req, res, async function(err){
            // console.log(req);
            if(err)
            {
                console.log('*****Multer Error ', err);
            }

            if(!req.body.content && !req.file)
            {
                return res.status(401).send('Atleast write some post or upload something');        //for ajax

                // req.flash('error', 'Atleast write some post or upload something');
                // return res.redirect('back');
            }

            let post= await Post.create({
                // content: req.body.content,
                user: req.user._id,
                //since we set the user to a User in request using setAuthenticated function
            })

            let contentPresent= false;
            if(req.body.content)
            {
                contentPresent= true;
                post.content= req.body.content;
            }

            let photoPresent= false;
            
            if(req.file){
                photoPresent= true;
                post.postphoto= Post.photoPath + '/' + req.file.filename;
            }
            post.save();

            if(req.xhr){
    
                // console.log(post.user.toString());
                let user= await User.findById(post.user.toString());
    
                // console.log(umser.name);
                
                return res.status(200).json({
                    data: {
                        post: post,
                        postUserName: user.name,
                        photoPresent: photoPresent,
                        contentPresent: contentPresent,
                        postUserId: user.id,
                        postUserAvatar: user.avatar
                    },
                    message: "Post Created"
                });
            }
            req.flash('success', 'Posted Successfully');
            return res.redirect('back');
            
        });
        
        
        
    }catch(err){

        req.flash('error', 'Error in creating post');
        console.log(err);
        // console.log("error in creating a post");
        return res.redirect('back');
    }
};

module.exports.destroy= function(req, res){
    Post.findById(req.params.id)
    .then(async(post)=> {
        // .id means converting the object id into string
        if(post.user==req.user.id)
        {
            
            //removing the image file from the directory
            if(post.postphoto && fs.existsSync(path.join(__dirname, '..', post.postphoto)))
            {
                //this will delete the previous image from the upload file
                fs.unlinkSync(path.join(__dirname, '..', post.postphoto));
            }
            

            //delete the associated likes of the post
            // await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({likeable: post._id, onModel: 'Post'});

            //delete all the likes associated with the comments in a post
            // await Like.deleteMany({_id: {$in: post.comments}});
            await Like.deleteMany({likeable: {$in: post.comments}, onModel: 'Comment'});

            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }

            req.flash('success', 'Post has been deleted');
            return res.redirect('back');
            
        }
        else
        {
            return res.redirect('back');
        }
    })
    .catch((err)=> {

        req.flash('error', 'Error in deleting the post');
        // console.log("Cannot find the post to delete", err);
        return res.redirect('back');
    })
}