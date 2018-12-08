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
  idUtente: String,
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
    PermessiUtente.find({idUtente:id},{annoScolastico:1,_id:0},function(err,cursor){
      if(err){
        reject(err)
      }
      else{

        let results = cursor.map(c=>c.toObject());
        let anni = [];
        results.forEach(e=>{  if(anni.indexOf(e.annoScolastico)==-1){anni.push(e.annoScolastico)} })
        console.log(anni);
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
module.exports.getPermessiUtenteByAnno = function(id,anno){
  return new Promise(function(resolve, reject) {
    PermessiUtente.find({idUtente:id,annoScolastico:anno},{annoScolastico:1,classi:1,materia:1,_id:0},(err,cursors)=>{
      if(err){
        reject(err)
      }
      else{
        let results = cursors.map(c=>c.toObject());
        resolve(results)
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------


//-------------------------------- UPDATE QUERIES ------------------------------
module.exports.updatePermesso = function(id,anno,materia,classi){
  return new Promise(function(resolve, reject) {
    PermessiUtente.updateOne({idUtente:id,annoScolastico:anno,materia:materia},{$set:{classi:classi}},function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        console.log(numAffected);
        resolve()
      }
    })
  });
}
//----------------------------------- /END -------------------------------------


//------------------------------ DELETE QUERIES --------------------------------
module.exports.deletePermesso = function(id,anno,materia){
  return new Promise(function(resolve, reject) {
    PermessiUtente.deleteOne({idUtente:id,annoScolastico:anno,materia:materia},function(err){
      if(err){
        reject(err)
      }
      else{
        resolve()
      }
    })
  });
}
module.exports.deleteAnno = function(anno){
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










//------------------------------------ RITAGLI ---------------------------------
// //eliminabile, non usata
// module.exports.getPermessiUtente = function(id){
//   return new Promise(function(resolve, reject) {
//     PermessiUtente.find({idUtente:id},function(err,results){
//       if(err){
//         reject(err)
//       }
//       else{
//         resolve(results)
//       }
//     })
//   });
// }
