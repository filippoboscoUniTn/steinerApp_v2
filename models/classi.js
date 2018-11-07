"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbConnection = require('../modules/databaseConnection');
//const anniScolastici = require('./anniScolastici')
//const studenti = require('./studenti')

const util = require('util');

let classiSchema = new Schema ({

    annoScolastico:String,
    classe:Number,
    sezione:{
        type:String,
        enum:['A','B','C','D','E','F','G','H','I']
    },
    materie:[String],
    maestroClasse:{
        nome:String,
        cognome:String
    },
    studenti:[Number] //array of students ids

},{collection:'Classi'});

let Classi = mongoose.model('Classe',classiSchema);

module.exports = Classi;

module.exports.getMaterieAndMaestroFromSezioneAndClasseAndAnnoScolastico = function(anno,classe,sezione){
  let promise = new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:anno,classe:classe,sezione:sezione},{materie:1,maestroClasse:1,_id:0})
          .then(results=>{
            let res = {};
            res.maestroClasse = results[0].maestroClasse
            res.materie = results[0].materie
            resolve(res)
          })
          .catch(err=>{
            reject(err);
          })
  });
  return promise;
};

module.exports.getMaterieFromAnnoScolastico = function (annoScolastico,callback){
    Classi.find({annoScolastico:annoScolastico},{materie:1,_id:0},function (err,results){
        console.log("results = "+ results);
        if(err){
            callback(err,null)
        }
        else{
            let materie = [];
            for(let i=0;i<results.length;i++){
                for(let j=0;j<results[i].materie.length;j++){
                    if(materie.indexOf(results[i].materie[j]) === -1){
                        materie.push(results[i].materie[j])
                    }
                }
            }
            callback(null,materie);
        }
    })
};

module.exports.getClassiFromAnnoScolasticoMateria = function (annoScolastico,materia,callback){
    Classi.find({annoScolastico:annoScolastico,materie:materia},{classe:1,_id:0},function (err,results){
        if(err){
            callback(err,null)
        }
        else{
            let classi = [];
            for(let i=0;i<results.length;i++){
                if(classi.indexOf(results[i].classe) === -1){
                    classi.push(results[i].classe);
                }
            }
            callback(null,classi)
        }
    })
};

module.exports.getSezioniFromAnnoScolasticoMateriaClasse = function (annoScolastico,materia,classe,callback){
    Classi.find({annoScolastico:annoScolastico,classe:classe,materie:materia},{sezione:1,_id:0},function (err,results){
        if(err){
            callback(err,null)
        }
        else{
            let sezioni =[];
            for(let i=0;i<results.length;i++){
                if(sezioni.indexOf(results[i].sezione)===-1){
                    sezioni.push(results[i].sezione);
                }
            }
            callback(null,sezioni);
        }
    })
};

module.exports.getStudentiFromAnnoScolasticoClasseSezione = function (annoScolastico,classe,sezione,callback){
    Classi.find({annoScolastico:annoScolastico,classe:classe,sezione:sezione},{studenti:1,_id:0},function (err,results){
        if(err){
            callback(err,null)
        }
        else{
            let studenti = results[0].studenti;
            callback(null,studenti);
        }
    })
};

module.exports.getClassiFromAnnoScolastico = function (annoScolastico,callback){
    Classi.find({annoScolastico:annoScolastico},{classe:1,_id:0},function (err,results){
        if(err){
            callback(err,null);
        }
        else{
            let classi = [];
            for(let i=0;i<results.length;i++){
                if(classi.indexOf(results[i].classe) === -1){
                    classi.push(results[i].classe);
                }
            }
            callback(null,classi)
        }
    })
};

// module.exports.getSezioniFromAnnoScolasticoAndClasse = function (annoScolastico,classe,callback){
//   Classi.find({annoScolastico:annoScolastico,classe:classe},{sezione:1,_id:0},function (err,results){
//     if(err){
//       callback(err)
//     }
//     else{
//       console.log("sezioni = " + results);
//       callback(null,results)
//     }
//   })
// }
module.exports.getSezioniFromAnnoScolasticoAndClasse = function (annoScolastico,classe){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,classe:classe},{sezione:1,_id:0})
          .then(sezioni=>{
            resolve(  sezioni.map(v => v.sezione)  )
          })
          .catch(err=>{
            reject(err)
          })
  });
}


module.exports.getStudentiFromAnnoScolasticoAndClasseAndSezione = function (annoScolastico,classe,sezione) {
  let promise = new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,classe:classe,sezione:sezione},{studenti:1,_id:0})
    .then(results=>{
      resolve(results[0].studenti)
    })
    .catch(err=>{
      reject(err)
    })
  });
  return promise
}

module.exports.getMaterieFromClasseAndAnnoScolastico = function (annoScolastico,classe,callback){
  Classi.find({annoScolastico:annoScolastico,classe:classe},{materie:1,_id:0},function(err,results){
    if(err){
      callback(err,null)
    }
    else{
      console.log("materie = " + results);
      callback(null,results)
    }
  })
}

module.exports.getStudentiFromAnnoScolastico = function (annoScolastico,callback){
  Classi.find({annoScolastico:annoScolastico},{studenti:1,_id:0},function (err,results){
    if(err){
      callback(err,null);
    }
    else{
      let studenti = [];
      for(let i=0;i<results.length;i++){
        for(let j=0;j<results[i].studenti.length;j++){
          if(studenti.indexOf(results[i].studenti[j]) === -1){
              studenti.push(results[i].studenti[j]);
          }
        }
      }
      callback(null,studenti)
    }
  })
}

module.exports.classeGiaEsistente = function (anno,classe,callback){
  Classi.find({annoScolastico:anno,classe:classe},function (err,results){
    if(err){
      callback(err,null);
    }
    else if(results.length !== 0){
      callback(null,true);
    }
    else{
      callback(null,false);
    }
  })
}

module.exports.getStudentiFromAnnoScolasticoAndClasse = function (anno,classe,callback){
  Classi.find({annoScolastico:anno,classe:classe},{studenti:1,_id:0},function (err,results){
    if(err){
      callback(err,null);
    }
    else{
      let studenti = [];
      for(let i=0;i<results.length;i++){
        for(let j=0;j<results[i].studenti.length;j++){
          studenti.push(results[i].studenti[j]);
        }
      }
      callback(null,studenti);
    }
  })
}

module.exports.updateClassi = function(oldAnno,newAnno,oldClasse,newClasse){

  let updatePromise = new Promise(function(resolve,reject){

    let condition = {annoScolastico:oldAnno,classe:oldClasse};
    let update = {annoScolastico:newAnno,classe:newClasse};
    let opts = {multi:true};

    Classi.update(condition,update,opts,function (err,numAffected){
      if(err){
        reject(err);
      }
      else{
        console.log("updateClassi resolving, numAffected = " + numAffected);
        resolve();
      }
    })
  })

return updatePromise

}

module.exports.rimuoviStudente = function(id){
  let prom = new Promise(function(resolve, reject) {
    Classi.find({studenti:id})
          .then(results=>{
            let new_studenti = results[0].studenti.slice()
            Classi.update({studenti:id},{$set:{studenti:new_studenti}})
          })
          .then(resolve())
          .catch(err=>reject(err))
  });
  return prom
}
module.exports.updateAnnoScolastico = function (cond,update,options){
  let prom = new Promise(function(resolve, reject) {
    Classi.update(cond,update,options,function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        resolve(numAffected)
      }
    })
  });

  return prom
}
module.exports.getStudentiClasse = function (anno,classe){
  let prom = new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:anno,classe:classe},{studenti:1,_id:0},function(err,results){
      if(err){
        reject(err)
      }
      else{
        let idStudenti = []
        results.map(v=>{  v.studenti.map(i=>{idStudenti.push(i)})  })
        resolve(idStudenti)
      }
    })
  });

  return prom
}

module.exports.deleteClasse = function (anno,classe){
  return new Promise(function(resolve, reject) {
    Classi.deleteMany({annoScolastico:anno,classe:classe},function (err,numAffected){
      if(err){
        reject(err)
      }
      else{
        resolve()
      }
    })
  });
}


module.exports.deleteSezione = function (anno,classe,sezione){
  return new Promise(function(resolve, reject) {
    Classi.deleteMany({annoScolastico:anno,classe:classe,sezione:sezione},function (err,numAffected){
      if(err){
        reject(err)
      }
      else{
        resolve()
      }
    })
  });
}

module.exports.updateSezione = function (oldAnno,oldClasse,oldSezione,newSezione){
  return new Promise(function(resolve, reject) {
    let conditions = {annoScolastico:oldAnno,classe:oldClasse,sezione:oldSezione};
    let updates = {
      annoScolastico:newSezione.annoScolastico,
      classe:newSezione.classe,
      sezione:newSezione.sezione,
      materie:newSezione.materie,
      maestroClasse:newSezione.maestroClasse
    }
    console.log("updates classe = " + updates)
    let options = {multi:true}
    Classi.update(conditions,updates,options,function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        console.log("numAffected = " + numAffected)
        resolve()
      }
    })
  });
}


module.exports.sezioneGiaEsistente = function (anno,classe,sezione){
  return new Promise(function(resolve, reject) {
    console.log("sezioneGiaEsistente : " + anno + classe + sezione)
    Classi.find({annoScolastico:anno,classe:classe,sezione:sezione},function(err,results){
      if(err){
        reject(err)
      }
      else{
        console.log("results esistenza sezione = " + results)
        if(!results.length){
          console.log("!results.length " + (!results.length))
          resolve(false)
        }
        else{
          console.log("else")
          resolve(true)
        }
      }
    })
  });
}

module.exports.getStudentiSezione = (anno,classe,sezione)=>{
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:anno,classe:classe,sezione:sezione},{studenti:1,_id:0},function(err,results){
      if(err){
        reject(err)
      }
      else{
        let idStudenti = [];
        results.map(v=>v.studenti.map(s=>idStudenti.push(s)));
        console.log("getStudenti, idStudenti = " + idStudenti);
        resolve(idStudenti)
      }
    })
  });
}
module.exports.aggiungiStudente = (id,anno,classe,sezione)=>{
  return new Promise(function(resolve, reject) {
    Classi.update({annoScolastico:anno,classe:classe,sezione:sezione},{$push:{studenti:id}},function(err,results){
      console.log("aggiungiStudente results " + util.inspect(results))
      if(err){
        reject(err)
      }
      else{
        resolve()
      }
    })
  });
}
module.exports.removeStudente = (id,anno,classe,sezione)=>{
  return new Promise(function(resolve, reject) {
    Classi.update({annoScolastico:anno,classe:classe,sezione:sezione},{$pull:{studenti:id}},function(err,results){
      console.log("removeStudente results " + util.inspect(results))
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

module.exports.getMaterieSezione = (anno,classe,sezione) =>{
  let ret = [];
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:anno,classe:classe,sezione:sezione},{materie:1,_id:0},function (err,results){
      if(err){
        reject(err)
      }
      else{
        for(let i=0;i<results.length;i++){
          for(let j=0;j<results[i].materie.length;j++){
            ret.push(results[i].materie[j])
          }
        }
        console.log("result materie = " + ret)
        resolve(ret)
      }
    })
  });
}





























//
