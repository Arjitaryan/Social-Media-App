const mongoose= require('mongoose');

const multer= require('multer');
const path= require('path');
const PHOTO_PATH= path.join('/uploads/posts/photos');

const postSchema= new mongoose.Schema({

    postphoto: {
        type: String,
    },

    content: {
        type: String,
        // required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //include the array of ids of all comments in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
    
}, {
    timestamps: true
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', PHOTO_PATH))
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + Date.now())
    }
})


//static
postSchema.statics.uploadedPhoto= multer({storage: storage}).single('postphoto');
// .single() is used because we are uploading only one file at once 

postSchema.statics.photoPath= PHOTO_PATH;

const Post= mongoose.model('Post', postSchema);

module.exports= Post;