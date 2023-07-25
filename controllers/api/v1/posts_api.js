const Post= require('../../../models/post');
const Comment= require('../../../models/comment');

module.exports.index= async function(req, res){

    let posts= await Post.find({})
    .sort('-createdAt')
    .populate('user')                //populating the user of each post
    .populate({                    //populating the comments in that post and the user of each of the comments         
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'user'
        }
    })
    .populate({                      //also polulating the user of post of the comments in that post
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'post',
            populate: {
                path: 'user'
            }
        }
    })

    return res.json(200, {
        message: "Lists of posts",
        posts: posts
    })
}

module.exports.destroy= async function(req, res){

    try{

        let post= await Post.findById(req.params.id);
    
        if(post.user==req.user.id)
        {
    
            post.deleteOne();
            await Comment.deleteMany({post: req.params.id})
            
            return res.json(200, {
                message: "Post and associated comment deleted successfully"
            })
        }
        else
        {
            return res.json(401, {
                message: "You cannot delete this post!"
            });
        }
        
    }catch(err){

        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}