"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('../modules/databaseConnection')


let AnniScolasticiSchema = new Schema({
    nome:String

},{collection:'AnniScolastici'});

let AnniScolastici = mongoose.model('AnniScolastici',AnniScolasticiSchema);

module.exports = AnniScolastici;

module.exports.getAnniScolastici = function (callback){
    AnniScolastici.find({},{nome:1,_id:0},function (err,results){
        if(err){
            callback(err,null);
        }
        else{
            callback(null,results);
        }
    })
};

module.exports.annoGiaEsistente = function(anno){
  let prom = new Promise(function(resolve, reject) {
    AnniScolastici.find({nome:anno},function(err,res){
      if(err){
        reject(err)
      }
      else{
        if(!res.length){
          resolve(false)
        }
        else{
          resolve(true)
        }
      }
    })
  });
  return prom
}
module.exports.updateAnnoScolastico = function(condition,update,options){
  let prom = new Promise(function(resolve, reject) {
    AnniScolastici.update(condition,update,options,function(err,numAffected){
      if(err)
      {reject(err)
      }
      else{
        resolve(numAffected)
        // let err = new Error("Errore nell'update, chiave manca..")
        // reject(err)
      }
    })
  });

  return prom
}
