
const express = require('express');
const dotenv = require('dotenv');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const path = require('path');
const app = express()
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')

// Routes include
const authRouter = require('./src/routes/authRouter')
const yonetimRouter = require('./src/routes/yonetim_auth')

// views config
app.set('view engine','ejs');
app.set('views', path.resolve(__dirname,'./src/views'))
app.use(expressLayout)
// static config
app.use(express.static((path.join(__dirname, 'public'))));
app.use(express.static(path.join(__dirname, 'public/panel/css/')));
app.use(express.static(path.join(__dirname, 'public/panel/img/')));
// dotenv
dotenv.config();

//Db connection
require('./src/config/database');

var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
  });
  
// Session Flash message
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24
    },
    store: store
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.validation_errors = req.flash('validation_errors');
    res.locals.success_message = req.flash('success_message');
    res.locals.login_errors = req.flash('error');
    next();
})
app.use(passport.initialize())
app.use(passport.session())
// formdan gelen degerlerin okunamasi icin 
app.use(express.urlencoded( {extended: true}))
// Routes
app.use('/',authRouter);
app.use('/yonetim/',yonetimRouter);

app.listen(process.env.PORT,()=>{
    console.log(process.env.PORT+ ' Portta Ayaktayım')
})