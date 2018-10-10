"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const util = require('util');

let pagelleSchema = new Schema({
    idStudente:{
        type:Number,
        require:true,
        unique:false
    },
    materia:{
        type:String,
        require:true,
        unique:false
    },
    classe:{
        type:Number,
        require:true,
        unique:false
    },
    sezione:{
        type:String,
        enum:['A','B','C','D','E','F','G','H','I'],
        require:true,
        unique:false
    },
    annoScolastico:{
        type:String,
        require:true,
        unique:false
    },
    primoSemestre:{
        type:String,
        default:""
    },
    secondoSemestre:{
        type:String,
        default:""
    }
},{collection:"Pagelle"});

pagelleSchema.index({idStudente:1,materia:1,classe:1,sezione:1,annoScolastico:1},{unique:true});

let Pagelle = mongoose.model('Pagelle',pagelleSchema);

module.exports = Pagelle;

module.exports.getPagellaFromStudente = function (annoScolastico,materia,classe,sezione,studente,callback){
    Pagelle.find({idStudente:studente.id,annoScolastico:annoScolastico,materia:materia,classe:classe,sezione:sezione},{primoSemestre:1,secondoSemestre:1,_id:0},function (err,results){
        if(err){
            callback(err,null);
        }
        else{
            if(results[0].length > 2){
                let error = new Error("Errore : lo studente detiene piu di 2 pagelle!");
                next(error,null);
            }
            else {
                callback(null,results[0]);
            }
        }
    })
};

module.exports.updatePagellaFromSemestre = function (annoScolastico,materia,classe,sezione,studente,semestre,nuovaPagella,callback){
    console.log("in update, semestre = " + semestre);
    if(semestre === String(1)){
        Pagelle.update({annoScolastico:annoScolastico,materia:materia,classe:classe,sezione:sezione,idStudente:studente.id},{$set:{primoSemestre:nuovaPagella}},function(err,numAffected){
            if(err){
                callback(err,null);
            }
            else{
                callback(null,numAffected);
            }
        });
    }
    else if(semestre === String(2)){
        Pagelle.update({annoScolastico:annoScolastico,materia:materia,classe:classe,sezione:sezione,idStudente:studente.id},{$set:{secondoSemestre:nuovaPagella}},function (err,numAffected){
            if(err){
                callback(err,null);
            }
            else{
                callback(null,numAffected);
            }
        })
    }
    else{
        let err = new Error("Semestre NON valido");
        callback(err,null);
    }
};

module.exports.updateClasse = function (annoScolastico,oldClasse,newClasse){

    let updatePromise = new Promise(function(resolve,reject){

      let condition = {annoScolastico:annoScolastico,classe:oldClasse};
      let update = {classe:newClasse};
      let opts = {multi:true};

      Pagelle.update(condition,update,opts,function (err,numAffected){
        if(err){
          reject(err);
        }
        else{
          console.log("updatePagelle resolving, numAffected = " + numAffected);
          resolve();
        }
      })
    })

  return updatePromise

};
