const Comment= require('../models/comment');
const Post= require("../models/post");

const User= require("../models/user");

const Like= require('../models/like');

const commentsMailer= require('../mailers/comments_mailer');

module.exports.create= function(req, res){
    Post.findById(req.body.post)
    .then(async(post)=> {
        if(post)
        {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            
            post.comments.push(comment);
            post.save();   //to set the memory in database from RAM

            let user= await User.findById(req.user._id);   //my method to populate the ajax request with comment's user's name

            comment= await comment.populate('user', 'name email');   //populating comment's - user's name and email
            commentsMailer.newComment(comment); 

            if(req.xhr){

                //it could have been used to populate in AJAX
                // comment= await comment.populate('user', 'name').execPopulate();  
                    
                return res.status(200).json({
                    data: {
                        comment: comment,
                        commentUserName: user.name,
                        commentUserId: user.id
                    },
                    message: "Comment Created"
                });
            }
            
        }
        
        req.flash('success', 'Your comment is posted');
        return res.redirect('/');
    })  
    .catch((err)=> {

        req.flash('error', 'Error in posting the comment');
        console.log("Error in finding the post of given id", err);
        return;
    })
};

module.exports.destroy= function(req, res){
    Comment.findById(req.params.id)
    .then(async (comment)=> {

        let postId= comment.post;
        let post= await Post.findById(postId);                 
        let userOfPost= post.user.toString();         //user of the post of the given comment

        //if user of given comment is same as req.user.id  or user of post of given comment is same as req.user.id, then comment can be deleted
        if(comment.user == req.user.id || userOfPost==req.user.id)  
        {
            postId= comment.post;
            comment.deleteOne();

            let post= await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}})

            //deleting the associated likes of the comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }
            
            req.flash('success', 'Comment has been deleted');
            return res.redirect('back');
        }
        else
        {
            return res.redirect('back');
        }
        
    })
    .catch((err)=> {

        req.flash('error', 'Error in deleting the comment');
        console.log("Cannot find the comment to delete", err);
        return;
    })
};