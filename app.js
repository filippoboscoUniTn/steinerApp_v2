"use strict";
//NPM PACKAGES
const express = require("express");
const validator = require("express-validator");
const session = require("express-session");
const hbsexprs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bCrypt = require("bcryptjs");
const passport = require("passport");
const	LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);


//DEFAULT PACKAGES
const path = require('path');
const util = require('util');


//MODULES
const dbConnection = require('./modules/databaseConnection');
const hbs = require('./modules/handlebarsEngine');

//MODELS
const users = require("./models/utenti");


//ROUTES
const router = require('./routes/router');


require('no-config')({
    config: require('./config')
}).then(
function(conf) {

    const app = express();


//set port from env, default is 8080
    app.set('port',(process.env.PORT || conf.various.port));


//serves static content
    app.use(express.static(path.join(__dirname,'public')));


//templates and views
    app.set('views',path.join(__dirname,'/views'));
    app.engine('hbs',hbs.engine);
    app.set('view engine','hbs');


//Parsers
    const urlEncodedParser = bodyParser.urlencoded({extended:true});
    const jsonParser = bodyParser.json();
    app.use(urlEncodedParser);
    app.use(jsonParser);
    app.use(validator({
        customValidators: {
            avalibleUsername:function(userName){
                return new Promise(function(resolve,reject){
                    users.findOne({username:userName})
                        .then(function(user){
                            if(user){
                                return reject(user)
                            }
                            return resolve(true)
                        })
                        .catch(function(err){
                            resolve(err)
                        })
                })
            }
        }
    }));


//Set session store
    let sessionStore = new MongoDBStore({
        db:dbConnection,
        collection:conf.sessionStore.collection
    });


// Use the session middleware
    app.use(session({
        secret: conf.sessionStore.secret,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: new Date(Date.now() + conf.sessionStore.maxAge),
            maxAge: conf.sessionStore.maxAge
        }
    }));


// Passport init
    app.use(passport.initialize());
    app.use(passport.session());


//Flash NB: Must create a session before flash can be used
    app.use(flash());


//Global variables
    app.use(function(req,res,next){
        //passport flash msgs are set in flash('error')
        res.locals.error = req.flash('error')
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    });


    app.use('/',router);


    app.listen(app.get('port'), function() {
        console.log('SteinerApp is running on port', app.get('port'));
    });


    module.exports = app;

})