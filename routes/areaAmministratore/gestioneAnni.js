"use strict";
const express =  require('express');

//Models
const AnniScolastici = require('../../models/anniScolastici');

//Modules
const util = require('util');

let router = express.Router();

router.get('/',function(req,res){
    AnniScolastici.getAnniScolastici(function(err,anniScolastici){
        if(err){
            next(err)
        }
        else{
            res.render('./areaAmministratore/gestioneDB/gestioneAnni',{layout:'authLayout',title:'Gestione Anni Scolastici',subTitle:'Gestione Anni Scolastici',anniScolastici:anniScolastici})
        }
    })
});

module.exports = router;