"use strict";

const express = require('express');
const validator = require("express-validator");

const Utenti = require('../models/utenti');

const Validators = require('../modules/validators');

let router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('./accesso/register',{layout:'noAuthLayout',title:'Registrazione',subTitle:'Registrazione'})
});

router.post('/',async (req,res,next)=>{
  try{
    const validationErrors = await Validators.registrationValidator(req)
    if(validationErrors.isEmpty()){
      let newUser = { nome:req.body.name,
                      cognome:req.body.surname,
                      email:req.body.email,
                      username:req.body.username,
                      password:req.body.password
                    }
        const insertUserResults = await new Utenti(newUser).insertUser()
        res.render('./accesso/successfulRegistration',{layout:'noAuthLayout',subTitle:"Registrazione effettuata con successo"})
    }
    else{
      let errors = validationErrors.array().map(error=>{return error.msg})
      res.render('./accesso/register', {layout:'noAuthLayout',title:'Errore nella registrazione',errors:errors,subTitle:"Registration"})
    }
  }catch(err){
    next(err)
  }

})

module.exports = router
