const nodeMailer= require('../config/nodemailer');


exports.resetPasswordMail= (resetPassword, requestEmail)=> {

    const htmlString= nodeMailer.renderTemplate({resetPassword: resetPassword}, '/reset_password/reset_link.ejs');

    nodeMailer.transporter.sendMail({
        from: 'arjitapp.com',
        to: requestEmail,
        subject: "Reset Password!",
        html: htmlString
    }, (err, info) => {
        if(err)
        {
            console.log('Error in sending mail', err);
            return;
        }

        // console.log("Message Sent", info);
        console.log("Message Sent");
        return;
    });
}