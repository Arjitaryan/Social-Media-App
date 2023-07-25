const Post= require('../models/post');
const User= require('../models/user');

module.exports.home= function(req, res){

    Post.find({
        $or:[                                   //populating the user's posts and his friend's post
            {user: {$in: req.user.friends}},
            {user: req.user.id},
        ]
    })
    .sort('-createdAt')
    .populate('user')                //populating the user of each post
    .populate({                    //populating the comments in that post and the user of each of the comments         
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'user'
        }
    })
    .populate({                             //populating the likes of comments of the post
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'likes'            
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
    .populate('likes')       //populating the likes of the posts
    // .exec()    //not neccessary if we are using .then()
    .then((posts)=> {

        User.find({})
        .then(async(users)=> {

            await res.locals.user.populate('friends');

            return res.render('home', {
                title: "Home Page",
                posts: posts,
                all_users: users
            });
        })
    })
    .catch((err)=> {
        console.log("Error in fetching posts from db");
        return;
    })    

};