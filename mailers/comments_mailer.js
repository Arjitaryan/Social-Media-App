const nodeMailer= require('../config/nodemailer');


//this is another method of exporting a method
exports.newComment= (comment)=> {
    console.log('Inside newComment mailer');

    const htmlString= nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'arjitapp.com',
        to: comment.user.email,
        subject: "New Comment Published!",
        // html: '<h1>Yup, your comment is now published</h1>'
        html: htmlString
    }, (err, info) => {
        if(err)
        {
            console.log('Error in sending mail', err);
            return;
        }

        console.log("Message Sent", info);
        return;
    });
}