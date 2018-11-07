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

module.exports.getPagellaFromStudenteCb = function (annoScolastico,materia,classe,sezione,studente,callback){
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
module.exports.getPagellaFromStudente = function(annoScolastico,classe,sezione,materia,id){
  console.log(annoScolastico + " " + classe + " " +sezione + " " + materia + " " + id)
  return new Promise(function(resolve, reject) {
      Pagelle.find({idStudente:id,annoScolastico:annoScolastico,classe:classe,sezione:sezione,materia:materia},{primoSemestre:1,secondoSemestre:1,_id:0},function (err,results){
          if(err){
            reject(err)
          }
          else{
            let pagella = {
              materia:materia,
              primoSemestre:results[0].primoSemestre,
              secondoSemestre:results[0].secondoSemestre,
            }
            resolve(pagella)
          }
      })
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

module.exports.updateAnnoScolastico = function (cond,update,options){
  return new Promise(function(resolve, reject) {
    Pagelle.update(cond,update,options,function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        resolve(numAffected)
      }
    })
  });
}

module.exports.updateClasse = function (oldAnno,newAnno,oldClasse,newClasse){

    let updatePromise = new Promise(function(resolve,reject){

      let condition = {annoScolastico:oldAnno,classe:oldClasse};
      let update = {annoScolastico:newAnno,classe:newClasse};
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

module.exports.updateSezione = function (oldAnno,oldClasse,oldSezione,newSezione){
  return new Promise(function(resolve, reject) {
    let conditions = {annoScolastico:oldAnno,classe:oldClasse,sezione:oldSezione}
    let updates = {
      annoScolastico:newSezione.annoScolastico,
      classe:newSezione.classe,
      sezione:newSezione.sezione
    }
    console.log("updates pagelle = " + updates)

    let options = {multi:true}
    Pagelle.update(conditions,updates,options,function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        console.log("numAffected" + util.inspect(numAffected) )
        resolve()
      }
    })
  });
}

module.exports.updateClasseStudente = function(id,newAnno,newClasse,newSezione,oldAnno,oldClasse,oldSezione){
  console.log("hello from updateClasseStudente")
  return new Promise(function(resolve, reject) {
    Pagelle.update({idStudente:id,annoScolastico:oldAnno,classe:oldClasse,sezione:oldSezione},  //condition
                    {annoScolastico:newAnno,classe:newClasse,sezione:newSezione},     //update
                    {multi:true}                                                        //options
                  ,function(err,numAffected){                                         //callback
                    console.log("updatePagelle " + numAffected)
                    if(err){
                      throw err
                      reject(err)
                    }
                    else{
                      resolve()
                    }
                  })
  });
}

module.exports.deletePagelleStudente = function (id){
  return new Promise(function(resolve, reject) {
    Pagelle.deleteMany({idStudente:id},function (err,numAffected){
        if(err){
          reject(err)
        }
        else{
          resolve()
        }
      })
  });
}

module.exports.popolaPagelleStudente = (id,anno,classe,sezione,materie)=>{
  return Promise.all( materie.map(m=>{
                        return new Promise(function(resolve, reject) {
                          new Pagelle({idStudente:id,annoScolastico:anno,classe:classe,sezione:sezione,materia:m,primoSemestre:"",secondoSemestre:""}).save(function(err,doc){
                            if(err){
                              reject(err)
                            }
                            else{
                              resolve()
                            }
                          })
                        });
                      })
                    )
}

























//
