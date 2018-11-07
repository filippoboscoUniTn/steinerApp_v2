"use strict";
const express = require("express");

const loginRoute = require('./loginRoute');
const logoutRoute = require('./logoutRoute');
const registerRoute = require('./registerRoute');
const indexRoute = require('./indexRoute');
const adminRouter = require('./adminRouter');
const pagelleRoute = require('./pagelleRoute');

const userAuthentication = require('../modules/userAuthentication');
const adminAuthentication = require('../modules/adminAuthentication');

let router = express.Router();


router.use('/login',loginRoute);
router.use('/register',registerRoute);
router.use('/logout',logoutRoute);

router.use('/admin',adminAuthentication,adminRouter);

router.use('/index',indexRoute);
router.use('/pagelle',pagelleRoute);
router.use('/',userAuthentication,function (req,res){
    res.redirect('/index');
});

router.use(function(req,res,next){
  console.log("404")
    let err = new Error('Page Not Found!');
    err.status = 404;
    next(err);
});

router.use(function(err,req,res,next){
  console.log("Error handler")
    res.status = (err.status || 500);
    if(req.isAuthenticated()){
        res.render('./errorPages/authedError',{layout:'authLayout',error_n:(err.status||500),error_message:err.message})
    }
    else{
        res.render('./errorPages/unAuthedError',{layout:'noAuthLayout',error_n:(err.status||500),error_message:(err.message||'Page Not Found!')})
    }
});










module.exports = router;
