'use strict';
const express = require('express');
let router = express.Router();

router.use('/',function(req,res,next){
    if(req.isAuthenticated() && req.user.status === 'ACCEPTED' && req.user.authorization === 'ADMIN'){
        return next()
    }
    else{
        if(req.isAuthenticated() && req.user.status === 'ACCEPTED' && req.user.authorization === 'TEACHER'){
            var err = new Error('Unauthorized');
            err.status = 401;
            next(err);
        }
        else{
            req.flash('error_msg','401 Unauthorized')
            res.redirect('/login')
        }
    }
})
module.exports = router
