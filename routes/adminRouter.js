"use strict";
const express = require('express');

//Routes
const gestioneAnniRouter = require('./areaAmministratore/gestioneAnni');
const gestioneUtentiRouter = require('./areaAmministratore/gestioneUtenti');
const stampaPdfRouter = require('./areaAmministratore/stampaPDF');
//Models

//Modules
let router = express.Router();

router.use('/gestioneAnni',gestioneAnniRouter);

router.use('/gestioneUtenti',gestioneUtentiRouter);

router.use('/stampaPDF',stampaPdfRouter);

router.get('/',function (req,res){
    res.render('./areaAmministratore/areaAmministratore',{layout:'authLayout',title:'Area Amministratore',subTitle:'Area Amministratore'});
});

module.exports = router;
