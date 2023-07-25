require('dotenv').config();

const development= {
    name: 'development',
    session_cookie_key: process.env.SOCIALAPP_SESSIONCOOKIE_KEY,
    db: 'proj_development',

    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS
        }
    },

    google_client_id: process.env.SOCIALAPP_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.SOCIALAPP_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.SOCIALAPP_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.SOCIALAPP_JWT_SECRET,
}

const production= {
    name: 'production',
    session_cookie_key: process.env.SOCIALAPP_SESSIONCOOKIE_KEY,
    db: 'proj_production',

    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS
        }
    },

    google_client_id: process.env.SOCIALAPP_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.SOCIALAPP_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.SOCIALAPP_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.SOCIALAPP_JWT_SECRET,
};

// module.exports= development;
module.exports= eval(process.env.SOCIALAPP_ENVIRONMENT) == undefined? development : eval(process.env.SOCIALAPP_ENVIRONMENT);