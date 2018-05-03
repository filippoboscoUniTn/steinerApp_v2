"use strict";
const express = require('express');
const validator = require("express-validator");
const users = require('../models/utenti');

let router = express.Router();


router.get('/',function(req,res){
    res.render('./accesso/register',{layout:'noAuthLayout',title:'Registrazione',subTitle:'Registrazione'})
});

router.post('/',function(req,res,next){

    req.checkBody('name','Nome obbligatorio').notEmpty();
    req.checkBody('surname','Cognome obbligatorio').notEmpty();
    req.checkBody('email','Email obbligatoria').notEmpty();
    req.checkBody('email','Indirizzo Email invalido').isEmail();
    req.checkBody('username','Nome utente obbligatorio').notEmpty();
    req.checkBody('username','Nome utente già utilizzato').avalibleUsername(req.body.username);
    req.checkBody('password','Password obbligatorio').notEmpty();
    req.checkBody('password2','Ripetere la password').notEmpty();
    req.checkBody('password','Le passwords non combaciano').equals(req.body.password2);

    req.asyncValidationErrors().then(function(){

        let newUser = new user(
            {
                name:req.body.name,
                surname:req.body.surname,
                email:req.body.email,
                userName:req.body.username,
                password:req.body.password
            }
        );

        newUser.insertUser(newUser,function(err,user,numAffected){
            if(err){
                next(err)
            }
            res.render('./accesso/successfulRegistration',{layout:'noAuthLayout',subTitle:"Registrazione effettuata con successo"})
        })

    },function(errors){
        res.render('./accesso/register', {layout:'noAuthLayout',title:'Errore nella registrazione',errors:errors,subTitle:"Registration"})
    })
});

module.exports = router;