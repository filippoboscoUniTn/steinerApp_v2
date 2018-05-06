'use strict';
const express = require('express')
let router = express.Router();

router.use('/',function(req,res,next){
    if(req.isAuthenticated() && req.user.status === 'ACCEPTED'){
        next();
    }
    else{
        req.flash('error_msg','Login necessario')
        res.redirect('/login')
    }
});

module.exports = router;