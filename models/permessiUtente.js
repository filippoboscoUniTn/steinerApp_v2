"use strict";
//------------------------------- NODE_MODULES ---------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//--------------------------------- /END ---------------------------------------

//------------------------------- MY MODULES -----------------------------------
const util = require('util');
const dbConnection = require('../modules/databaseConnection');
const utenti = require('./utenti');
//-------------------------------- /END ----------------------------------------




//------------------------------- PERMESSI  MODEL ------------------------------
let permessiUtenteSchema = new Schema ({
  nome : String,
  cognome : String,
  annoScolastico : String,
  permessi : [
    {
      materia : String,
      classi : [ Number ]
    }
  ]
},{collection:'PermessiUtente'});

let PermessiUtente = mongoose.model('PermessiUtente', permessiUtenteSchema);

module.exports = PermessiUtente;
//-------------------------------- /END ----------------------------------------


//-------------------------------- GET QUERIES ---------------------------------
                        //to check ret val
module.exports.getAnniScolasticiUtente = function (nome,cognome){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({nome:nome,cognome:cognome},{annoScolastico:1,_id:0},function (err,results){
      if(err){
        reject(err)
      }
      else{
        let anni = [];
        for(let i=0;i<results.length;i++){
          let annoTmp = {nome:results[i].annoScolastico};
          anni.push(annoTmp)
        }
        resolve(anni)
      }
    })
  });
};
                        //to check ret val
module.exports.getMaterieFromAnnoScolastico = function (nome,cognome,annoScolastico) {
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({nome:nome,cognome:cognome,annoScolastico:annoScolastico},{permessi:1,_id:0},function (err,permessi){
      if(err){
        reject(err)
      }
      let materie = [];
      for(let i=0;i<permessi[0].permessi.length;i++){
        materie.push(permessi[0].permessi[i].materia)
      }
      resolve(materie);
    })
  });
};

module.exports.getClassiFromAnnoScolasticoMateria = function (nome,cognome,annoScolastico,materia){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({nome:nome,cognome:cognome,annoScolastico:annoScolastico,'permessi.materia':materia},{'permessi.$':1,_id:0},function (err,results){
      if(err){
        reject(err)
      }
      else{
        let classi = [];
        for(let i=0;i<results[0].permessi.length;i++){
          for(let j=0;j<results[0].permessi[i].classi.length;j++){
            classi.push(results[0].permessi[i].classi[j]);
          }
        }
        resolve(classi)
      }
    })
  });
};

module.exports.getPermessiUtente = function(utente){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({nome:utente.nome,cognome:utente.cognome},function(err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results)
      }
    })
  });
}

module.exports.getPermessiUtenteByAnno = async(utente,anno)=>{
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({nome:utente.nome,cognome:utente.cognome,annoScolastico:anno},(err,results)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(results)
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------


//------------------------------ DELETE QUERIES --------------------------------
module.exports.deleteAnno = anno=>{
  return new Promise(function(resolve, reject) {
    PermessiUtente.deleteMany({annoScolastico:anno},(err,numAffected)=>{
      if(err){
        reject(err)
      }
      else{
        resolve()
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------
