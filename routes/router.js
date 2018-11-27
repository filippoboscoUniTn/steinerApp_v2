"use strict";
const express = require("express");

const loginRouter = require('./loginRouter');
const logoutRouter = require('./logoutRoute');
const registerRouter = require('./registerRouter');
const indexRouter = require('./indexRouter');
const adminRouter = require('./adminRouter');
const pagelleRouter = require('./pagelleRoute');

const userAuthentication = require('../modules/userAuthentication');
const adminAuthentication = require('../modules/adminAuthentication');

let router = express.Router();


//----------------------- MIDDLEWARE PER MESSAGGI FLASH ------------------------
router.use(function(req,res,next){
  if(req.session.successMsg != null){
    res.locals.successMsg = req.session.successMsg;
    delete req.session.successMsg;
  }
  if(req.session.errorMsg != null){
    res.locals.errorMsg = req.session.errorMsg;
    delete req.session.errorMsg;
  }
  next();
});
//----------------------------------- END --------------------------------------


router.use('/login',loginRouter); //ok
router.use('/register',registerRouter); //ok
router.use('/logout',logoutRouter); //ok

router.use('/admin',adminAuthentication,adminRouter);

router.use('/index',indexRouter); //ok

router.use('/pagelle',pagelleRouter); //ok

router.use('/',userAuthentication,function (req,res){
    res.redirect('/index');
});

router.use(function(req,res,next){
    let err = new Error('Page Not Found!');
    err.status = 404;
    next(err);
});

router.use(function(err,req,res,next){
  console.log("herror handler")
  throw err
    res.status = (err.status || 500);
    if(req.isAuthenticated()){
        res.render('./errorPages/authedError',{layout:'authLayout',error_n:(err.status||500),error_message:err.message})
    }
    else{
        res.render('./errorPages/unAuthedError',{layout:'noAuthLayout',error_n:(err.status||500),error_message:(err.message||'Page Not Found!')})
    }
});










module.exports = router;
