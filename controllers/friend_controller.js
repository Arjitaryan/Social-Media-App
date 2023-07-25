const User= require('../models/user');
const Friendship= require('../models/friendship');

module.exports.addFriend= async function(req, res){
    try{
        let fromUser= req.user;

        let found= fromUser.friends.find(friend => friend._id == req.params.id)

        if(found)
        {
            req.flash('error', 'This user is already in your friend list');
        }
        else
        {

            let toUser= await User.findById(req.params.id);
    
            // let newFriendship= await Friendship.create({
            //     from_user: fromUser,
            //     to_user: toUser
            // });
    
    
    
            fromUser.friends.push(toUser);
            fromUser.save();
            toUser.friends.push(fromUser);
            toUser.save();

            req.flash('success', 'Added to your Friendlist');
        }

        return res.redirect('back');

    }catch(err){
        console.log("Error in adding friend", err);
        return res.redirect('back');
    }
};

module.exports.removeFriend= async function(req, res){
    try{
        let fromUser= req.user;
        let toUser= await User.findById(req.params.id);

        fromUser.friends.pull(toUser._id);
        fromUser.save();

        toUser.friends.pull(fromUser._id);
        toUser.save();

        req.flash('success', 'Removed from your Friendlist');
        return res.redirect('back');

    }catch(err){
        console.log("Error in removing friend", err);
        return res.redirect('back');
    }
};