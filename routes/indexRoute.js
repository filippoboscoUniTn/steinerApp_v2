"use strict";
const express = require('express');

//Models
const permessiUtente = require('../models/permessiUtente');
const anniScolastici = require('../models/anniScolastici');
//Moduels
const userAuthentication = require('../modules/userAuthentication');

let router = express.Router();

router.use(userAuthentication);

router.get('/',function(req,res,next){
    let isAdmin = false; //Controlla se l'utente è admin
    if(req.user.authorization === 'ADMIN'){
        isAdmin = true;
    }
    if(isAdmin){//L'utente è admin, mostra tutte le classi
        anniScolastici.getAnniScolastici(function (err,anni){
            if(err){
                next(err);
            }
            res.render('index',{title:'Home',anniScolastici:anni,titoloSezione:'Anni Scolastici'})
        })
    }
    else{//L'utente NON è admin, mostra solo le classi relative ai suoi permessi
        //Trova nei permessi gli anni a cui l'utente ha accesso
        let nome = req.user.nome;
        let cognome = req.user.cognome;
        console.log("/index info utente : nome = " +nome + "\t cognome = " + cognome);
        permessiUtente.getAnniScolasticiUtente(nome,cognome,function (err,anni){
            if(err){
                next(err)
            }
            res.render('index',{title:'Home',anniScolastici:anni,titoloSezione:'Anni Scolastici'})
        })
    }
});

module.exports = router;