const express= require('express');
const env= require('./config/environment');
require('dotenv').config();
const cookieParser= require('cookie-parser');
const app= express();
const port= 8000;
const expressLayouts= require('express-ejs-layouts');
const db= require('./config/mongoose');

//used for session cookie
const session= require('express-session');
const passport= require('passport');
const passportLocal= require('./config/passport-local-strategy');

//jwt passport authentication
const passportJWT= require('./config/passport-jwt-strategy');


// for google authentication
const passportGoogle= require('./config/passport-google-oauth2-strategy');


const MongoStore= require('connect-mongo');

//for flash messages
const flash= require('connect-flash');

//custom middleware to set flash messages to response from request
const customMware= require('./config/middleware');

//set up the chat server to be used with socket.io
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening to port no. 5000");

app.use(express.urlencoded());

//setting up cookie parser to deal with the cookie data
app.use(cookieParser());

//setting up static files such as css, js
app.use(express.static('./assets'));

//making the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//setting up layouts
app.use(expressLayouts);

//extract style and scrits from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setting up ejs (view engine)
app.set('view engine', 'ejs');
app.set('views', './views');

//setting up express session so that cookie will be stored in an encrypted format
//mongo store is used tp store the session cookie in the db
app.use(session({
    name: 'arjitApp',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    
    store: MongoStore.create(
        {
            mongoUrl: `mongodb://localhost/${env.db}`,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'console-mongodb setup ok');
        } 
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err)
    {
        console.log(`Error while loading the app: ${err}`);
        return;
    }

    console.log(`Server is running on port no. ${port}`);

});