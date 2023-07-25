const Like= require('../models/like');
const Post= require('../models/post');
const Comment= require('../models/comment');

module.exports.toggleLike= async function(req, res){
    try{

        //likes/toggle/?id= asdasdsadsd&type=Post

        let postOrComment;
        let deleted= false;

        if(req.query.type == 'Post'){
            postOrComment= await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            postOrComment= await Comment.findById(req.query.id).populate('likes');
        }

        // console.log(req.query.type);

        //check if a like already exists
        let existingLike= await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        });


        //if a like already exits then delete it
        if(existingLike)
        {
            postOrComment.likes.pull(existingLike._id);
            postOrComment.save();

            existingLike.deleteOne();
            deleted= true;
        }
        else     
        {
            //else make a new like 
            let newLike= await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            postOrComment.likes.push(newLike._id);
            postOrComment.save();
        }

        
        
        if(req.xhr){
            
            return res.json(200, {
                message: 'request successful',
                data: {
                        deleted: deleted,
                        likeableType: req.query.type
                    }
                })
        }
        
        
        
        if(!deleted)
        {
            if(req.query.type=='Post')
            {
                req.flash('success', 'You liked the post');
            }
            else
            {
                req.flash('success', 'You liked the comment');
            }
        }
        else
        {
            req.flash('success', 'You removed the like');
        }

        return res.redirect('back');
        
    }catch(err){
        
        // console.log(err);
        // return res.redirect('back');
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}


module.exports.fetchLikes= async function(req, res){
    try{
        let postOrComment;
        // console.log(req);
        if(req.query.type == 'Post'){
            postOrComment= await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            postOrComment= await Comment.findById(req.query.id).populate('likes');
        }
        
        let isLiked= false;
        postOrComment.likes.map((element) =>{

            if(element.user.toString() == req.user.id)
            {
                isLiked= true;
            }
        });

        return res.json(200, {
            message: 'request successful',
            liked: isLiked
        });

    }catch(err){

        console.log(err.responseText);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}