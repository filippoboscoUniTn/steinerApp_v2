"use strict";

const express = require('express');

let router = express.Router();

router.get('/',function(req,res){
    req.logout();
    req.flash('success_msg','Logout effettuato con successo!')
    res.redirect('/login')
});

module.exports = router;
