"use strict";

//------------------------------- NODE_MODULES ---------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//--------------------------------- /END ---------------------------------------

//------------------------------- MY MODULES -----------------------------------
const dbConnection = require('../modules/databaseConnection')
//-------------------------------- /END ----------------------------------------




//------------------------ ANNI SCOLASTICI  MODEL ------------------------------
let AnniScolasticiSchema = new Schema({
    nome:String

},{collection:'AnniScolastici'});

let AnniScolastici = mongoose.model('AnniScolastici',AnniScolasticiSchema);

module.exports = AnniScolastici;
//-------------------------------- /END ----------------------------------------


//-------------------------------- GET QUERIES ---------------------------------
module.exports.getAnniScolastici = function (){
  return new Promise(function(resolve, reject) {
    AnniScolastici.find({},{nome:1,_id:0},function (err,results){
        if(err){
            reject(err);
        }
        else{
            resolve(results);
        }
    })
  });
};
//-------------------------------- /END ----------------------------------------


//------------------------------ UPDATE QUERIES --------------------------------
module.exports.updateAnnoScolastico = function(oldAnno,newAnno){
  return new Promise(function(resolve, reject) {
    AnniScolastici.update({nome:oldAnno},{nome:newAnno},{multi:true},function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        resolve(numAffected)
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------


//------------------------------ DELETE QUERIES --------------------------------
module.exports.deleteAnno = anno=>{
  return new Promise(function(resolve, reject) {
    AnniScolastici.deleteOne({nome:anno},(err,numAffected)=>{
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


//------------------------------ MISCELLANEOUS ---------------------------------
module.exports.annoGiaEsistente = function(anno){
  return new Promise(function(resolve, reject) {
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
}
//-------------------------------- /END ----------------------------------------
