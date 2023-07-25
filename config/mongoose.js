//require the library
const env= require('./environment');
const mongoose= require('mongoose');

//connect to the database in development environment
mongoose.connect(`mongodb://localhost/${env.db}`);

//acquire the connection (to check if it is successful)
const db= mongoose.connection;

//error
db.on('error', console.log.bind(console, "Error connecting to MongoDB"));

//Up and running then print the message
db.once('open', function(){
    console.log("Connected to database")
});

module.exports= db;