const mongoose= require('mongoose');

const multer= require('multer');
const path= require('path');
const AVATAR_PATH= path.join('/uploads/users/avatars');

const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        default: '/Images/default-profile-pic.png'
    },

    friends: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ]
    
}, {
    timestamps: true
    //to store the data when it is created and last updated
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH))
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + Date.now())
    }
})


//static
userSchema.statics.uploadedAvatar= multer({storage: storage}).single('avatar');
// .single() is used because we are uploading only one file at once 

userSchema.statics.avatarPath= AVATAR_PATH;

const User= mongoose.model('User', userSchema);

module.exports= User;