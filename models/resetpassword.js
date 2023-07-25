const mongoose= require('mongoose');

const resetPasSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     
    accessToken: {
        type: String,
        required: true,
    },

    isValid: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const ResetPassword= mongoose.model('ResetPassword', resetPasSchema);

module.exports= ResetPassword;