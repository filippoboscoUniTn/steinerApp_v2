"use strict";
const express = require('express');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const users = require('../models/utenti');
let router = express.Router();

passport.use(new LocalStrategy(
    function(username,password,done){
        users.findByName(username,function(err,utente){
            if(err){
                next(err)
            }
            if(!utente){
                return done(null,false,{message:'Unknown username and password combination'})
            }
            users.comparePasswords(password,utente.password,function(err,isMatch){
                if(err){
                    next(err)
                }
                if(!isMatch){
                    return done(null,false,{message:'Unknown username and password combination'})
                }
                else{
                    return done(null,utente)
                }
            })
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    users.findUserById(id,function(err, user) {
        done(err, user)
    })
});


router.post('/',passport.authenticate('local',{successRedirect:'/index',failureRedirect:'/login',failureFlash:true}),function(req,res,next){

});

router.get('/',function(req,res){
    res.render('./accesso/login',{layout:'noAuthLayout',title:'Login',subTitle:'Login'})
});


module.exports = router;