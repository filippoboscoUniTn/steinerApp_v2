"use strict";
const express = require('express');

//Routes
const gestioneAnniRoute = require('./areaAmministratore/gestioneAnni');
const gestioneUtentiRoute = require('./areaAmministratore/gestioneUtenti');
const stampaPdfRoute = require('./areaAmministratore/stampaPDF');
//Models
//Modules
let router = express.Router();

router.use('/gestioneAnni',gestioneAnniRoute);

//router.use('/gestioneUtenti',gestioneUtentiRoute);

router.use('/stampaPDF',stampaPdfRoute);

router.get('/',function (req,res){
    res.render('./areaAmministratore/areaAmministratore',{layout:'authLayout',title:'Area Amministratore',subTitle:'Area Amministratore'});
});

module.exports = router;