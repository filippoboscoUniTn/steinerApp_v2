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


//------------------------------ PERMESSI  SCHEMA ------------------------------
let schemaPermessiUtente = new Schema ({
  idUtente: Schema.Types.ObjectId,
  annoScolastico: String,
  materia: String,
  classi: [Number]
},{collection:'PermessiUtente'})

schemaPermessiUtente.index({idUtente:1,annoScolastico:1,materia:1},{unique:true});
let PermessiUtente = mongoose.model('PermessiUtente', schemaPermessiUtente);

module.exports = PermessiUtente;
//-------------------------------- /END ----------------------------------------


//-------------------------------- GET QUERIES ---------------------------------
module.exports.getAnniScolasticiUtente = function (id){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({idUtente:id},{annoScolastico:1,_id:0},function (err,results){
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
module.exports.getMaterieFromAnnoScolastico = function (id,annoScolastico) {
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({idUtente:id,annoScolastico:annoScolastico},function (err,permessi){
      if(err){
        reject(err)
      }

      let materie = results.map(r=>r.materia)
      console.log("getMaterieFromAnnoScolastico, materie = > " + materie);
      resolve(materie);
    })
  });
};

module.exports.getClassiFromAnnoScolasticoMateria = function (id,annoScolastico,materia){
  return new Promise(function(resolve, reject) {
    PermessiUtente.findOne({idUtente:id,annoScolastico:annoScolastico,materia:materia},function (err,result){
      if(err){
        reject(err)
      }
      else{
        resolve(result.classi)
      }
    })
  });
};
//eliminabile, non usata
module.exports.getPermessiUtente = function(id){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({idUtente:id},function(err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results)
      }
    })
  });
}
//controllare dove viene usata
module.exports.getPermessiUtenteByAnno = function(id,anno){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({idUtente:id,annoScolastico:anno},(err,results)=>{
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

//-------------------------------- UPDATE QUERIES ------------------------------

//----------------------------------- /END -------------------------------------

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
