"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoInc = require('./autoIncrement');
const dbConnection = require('../modules/databaseConnection');

const util = require('util');

let studentiSchema = new Schema({
    id:{
        type: Number,
        //require: true
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

module.exports.getStudentiFromID = function (idStudenti,callback){
  let promiseChainStudenti = [];
  for(let i=0;i<idStudenti.length;i++){
      let promiseInfoStudente = new Promise(function (resolve,reject){
          Studenti.find({id:idStudenti[i]},function (err,results){
              if(err){
                  reject(err)
              }
              else{
                  resolve(results[0]);
              }
          })
      });
      promiseChainStudenti.push(promiseInfoStudente);
  }
  Promise.all(promiseChainStudenti).then(studenti =>{
        callback(null,studenti)
  },err =>{
      callback(err,null);
  })
};

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

  return promises
}
module.exports.getInfoStudente = async id =>{
  return new Promise(function(resolve, reject) {
    Studenti.find({id:id},{__v:0,_id:0},(err,res)=>{
      if(err){reject(err)}
      else{resolve(res[0])}
    })
  });
}
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
