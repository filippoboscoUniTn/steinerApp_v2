"use strict";
//------------------------------- NODE_MODULES ---------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('util');
//--------------------------------- /END ---------------------------------------

//------------------------------- MY MODULES -----------------------------------
const dbConnection = require('../modules/databaseConnection');
//-------------------------------- /END ----------------------------------------

//-------------------------------- MODELS --------------------------------------
const autoInc = require('./autoIncrement');
//-------------------------------- /END ----------------------------------------




//--------------------------------   MODEL -------------------------------------

let studentiSchema = new Schema({
    id:{
        type: Number,
    },
    nome:{
        type: String,
        require: true
    },
    cognome:{
        type: String,
        require: true
    },
    ammesso:{
        type: Boolean,
        default:true
    },
    luogoNascita:{
        type:String,
    },
    dataNascita:{
        type:Date
    },
    residenza:{
        comune:String,
        cap:Number,
        indirizzo:{
            via:String,
            numeroCivico:Number
        }
    }
},{collection:'Studenti'});

studentiSchema.pre('save',function(next){
    let doc = this;
    autoInc.findByIdAndUpdate({_id:'studentCounter'},{$inc:{seq:1}},function(err,counterVal){
        if(err){
            return next(err)
        }
        doc.id = counterVal.seq;
        next(counterVal.seq);
    })
});

let Studenti = mongoose.model('Studente',studentiSchema);

module.exports = Studenti;
//-------------------------------- /END ----------------------------------------


//-------------------------------- GET QUERIES ---------------------------------
module.exports.getInfoStudentiById = function(idStudenti){
  let promises = idStudenti.map(id=>{
    let promise = new Promise(function(resolve, reject) {
      Studenti.find({id:id},{_id:0})
              .then(results=>{
                resolve(results[0])
              })
              .catch(err=>{
                reject(err)
              })
    });
    return promise
  })

  return Promise.all(promises)
}

module.exports.getInfoStudente = id =>{
  return new Promise(function(resolve, reject) {
    Studenti.find({id:id},{__v:0,_id:0},(err,res)=>{
      if(err){reject(err)}
      else{resolve(res[0])}
    })
  });
}

//-------------------------------- /END ----------------------------------------


//------------------------------ UPDATE QUERIES --------------------------------
module.exports.updateStudente = (id,modifiche) =>{
  return new Promise(function(resolve, reject) {
    Studenti.update({id:id},modifiche,function(err,numAffected){
      console.log("numAffected = " + numAffected[0])
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


//------------------------------ DELETE QUERIES --------------------------------
module.exports.deleteStudenteById = function (id){
  return new Promise(function(resolve, reject) {
    Studenti.deleteMany({id:id},function (err,numAffected){
        if(err){
          throw err
          //reject(err)
        }
        else{
          resolve()
        }
      })
  });
}
//-------------------------------- /END ----------------------------------------


//------------------------------ MISCELLANEOUS ---------------------------------
module.exports.removeStudente = function(id){
  let prom = new Promise(function(resolve, reject) {
    Studenti.deleteOne({id:id},function(err,numAffected){
      console.log("removeStudente")
      if(err){
        console.log("err")
        reject(err)
      }
      else{
        console.log("resolvig")
        resolve()
      }
    })
  });
  return prom
}
module.exports.saveWrapper = studente => {
  return new Promise(function(resolve, reject) {
    studente.save((err,studente)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(studente)
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------
