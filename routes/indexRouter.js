"use strict";
const express = require('express');

//Models
const PermessiUtente = require('../models/permessiUtente');
const AnniScolastici = require('../models/anniScolastici');
//Moduels
const userAuthentication = require('../modules/userAuthentication');
const utilityFunctions = require('../modules/utilityFunctions');
let router = express.Router();

router.use(userAuthentication);

router.get('/',async function(req,res,next){
  let isAdmin = (req.user.authorization === 'ADMIN')
  let nome = req.user.nome;
  let congome = req.user.cognome;

  const anni = await AnniScolastici.getAnniScolastici();

  if(isAdmin){
    res.render('index',{title:'Home',anniScolastici:anni,subtitle:'Anni Scolastici'})
  }
  else{
    const anniPermessi = await PermessiUtente.getAnniScolasticiUtente(nome,cognome);
    let anniVisibili = utilityFunctions.intersect(anni,anniPermessi)
    res.render('index',{title:'Home',titoloSezione:'Anni Scolastici',anniScolastici:anniVisibili})
  }
});

router.get('/test',async (req,res,next)=>{
  res.render('test',{layout:'testLayout',title:'Test'})
})

module.exports = router;
