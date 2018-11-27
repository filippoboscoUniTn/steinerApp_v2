"use strict";

const express = require('express');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const Utenti = require('../models/utenti');


let loginStrategy = async (username,password,done)=>{
  try{

    let user = await Utenti.getUserByUsername(username)
    if(!user){
      return done(null,false,{message:'Unknown username and password combination'})
    }

    let isMatch = await Utenti.comparePasswords(password,user.password)
    if(!isMatch){
      return done(null,false,{message:'Unknown username and password combination'})
    }
    else if(user.status === 'ACCEPTED'){
      return done(null,user.id)
    }
    else{
      return done(null,false,{message:"La sua richiesta non è ancora stata accettata.\nPotrà effettuare il login non appena un amministratore avrà accettato la sua richiesta"})
    }

  }
  catch(err){

    return done(err)

  }
}

passport.use(new LocalStrategy(loginStrategy))

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(id, done) {
  Utenti.getUserForDeserialize(id,function(err,user){
    done(err,user )
  })
});

let router = express.Router();

router.post('/',passport.authenticate('local',{ successRedirect:'/index',
                                                failureRedirect:'/login',
                                                failureFlash:true}),
                                                function(req,res,next){

});

router.get('/',function(req,res){
  console.log("GET : " + req.url)
    if(req.isAuthenticated()&& (req.user.status === 'ACCEPTED')){//User is alredy loged in, redirect to homepage
          console.log("redirecting to /index")
          res.redirect('/index');
    }
    else{//User is not yet authenticated, render login page
        res.render('./accesso/login',{layout:'noAuthLayout',title:'Login',subTitle:'Login'});
    }
});


module.exports = router;
