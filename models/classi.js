"use strict";


//------------------------------- NODE_MODULES ---------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//--------------------------------- /END ---------------------------------------


//------------------------------- MY MODULES -----------------------------------
const dbConnection = require('../modules/databaseConnection');
//-------------------------------- /END ----------------------------------------


//------------------------------ CLASSI  MODEL ---------------------------------
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
//-------------------------------- /END ----------------------------------------


//-------------------------------- GET QUERIES ---------------------------------
module.exports.getMaterieAndMaestroFromSezioneAndClasseAndAnnoScolastico = function(anno,classe,sezione){
  return new Promise(function(resolve, reject) {
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
};

module.exports.getMaterieFromAnnoScolastico = function (annoScolastico){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico},{materie:1,_id:0},function (err,results){
        if(err){
            reject(err)
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
            resolve(materie);
        }
    })
  });
};

module.exports.getMaterieSezione = (anno,classe,sezione) =>{
  return new Promise(function(resolve, reject) {
    let ret = [];
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

module.exports.getMaterieFromClasseAndAnnoScolastico = function (annoScolastico,classe){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,classe:classe},{materie:1,_id:0},function(err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results)
      }
    })
  });
}

module.exports.getClassiFromAnnoScolastico = function (annoScolastico){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico},{classe:1,_id:0},function (err,results){
        if(err){
            reject(err)
        }
        else{
            let classi = [];
            for(let i=0;i<results.length;i++){
                if(classi.indexOf(results[i].classe) === -1){
                    classi.push(results[i].classe);
                }
            }
            resolve(classi)
        }
    })
  });
};

module.exports.getClassiFromAnnoScolasticoMateria = function (annoScolastico,materia){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,materie:materia},{classe:1,_id:0},function (err,results){
      if(err){
        reject(err)
      }
      else{
        let classi = [];
        for(let i=0;i<results.length;i++){
          if(classi.indexOf(results[i].classe) === -1){
            classi.push(results[i].classe);
          }
        }
        resolve(classi)
      }
    })
  });
};

module.exports.getSezioniFromAnnoScolasticoMateriaClasse = function (annoScolastico,classe,materia){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,classe:classe,materie:materia},{sezione:1,_id:0},function (err,results){
        if(err){
          reject(err)
        }
        else{
            let sezioni =[];
            for(let i=0;i<results.length;i++){
                if(sezioni.indexOf(results[i].sezione)===-1){
                    sezioni.push(results[i].sezione);
                }
            }
            resolve(sezioni)
        }
    })
  });
};

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

module.exports.getStudentiFromAnnoScolasticoClasseSezione = function (annoScolastico,classe,sezione){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,classe:classe,sezione:sezione},{studenti:1,_id:0},function (err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results[0].studenti)
      }
    })
  });
};

module.exports.getStudentiFromAnnoScolasticoAndClasseAndSezione = function (annoScolastico,classe,sezione) {
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico,classe:classe,sezione:sezione},{studenti:1,_id:0},(err,results)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(results[0].studenti)
      }
    })
  });
}

module.exports.getStudentiClasse = function (anno,classe){
  return new Promise(function(resolve, reject) {
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

module.exports.getStudentiFromAnnoScolastico = function (annoScolastico,callback){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:annoScolastico},{studenti:1,_id:0},function (err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results[0])
      }
    })

  });
}
//-------------------------------- /END ----------------------------------------


//------------------------------ UPDATE QUERIES --------------------------------
module.exports.updateAnnoScolastico = function (cond,update,options){
  return new Promise(function(resolve, reject) {
    Classi.update(cond,update,options,function(err,numAffected){
      if(err){
        reject(err)
      }
      else{
        resolve(numAffected)
      }
    })
  });
}

module.exports.updateClassi = function(oldAnno,newAnno,oldClasse,newClasse){
  return new Promise(function(resolve,reject){

    let condition = {annoScolastico:oldAnno,classe:oldClasse};
    let update = {annoScolastico:newAnno,classe:newClasse};
    let opts = {multi:true};

    Classi.update(condition,update,opts,function (err,numAffected){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    })

  })
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
    let options = {multi:true}
    Classi.update(conditions,updates,options,function(err,numAffected){
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
module.exports.deleteAnno = anno=>{
  Classi.deleteMany({annoScolastico:anno},(err,numAffected)=>{
    if(err){
      reject(err)
    }
    else{
      resolve()
    }
  })
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
//-------------------------------- /END ----------------------------------------

//------------------------------ MISCELLANEOUS ---------------------------------
module.exports.classeGiaEsistente = (anno,classe)=>{
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:anno,classe:classe},function (err,results){
      if(err){
        reject(err);
      }
      else if(results.length !== 0){
        resolve(true);
      }
      else{
        resolve(false);
      }
    })
  });
}

module.exports.sezioneGiaEsistente = function (anno,classe,sezione){
  return new Promise(function(resolve, reject) {
    Classi.find({annoScolastico:anno,classe:classe,sezione:sezione},function(err,results){
      if(err){
        reject(err)
      }
      else{
        if(!results.length){
          resolve(false)
        }
        else{
          resolve(true)
        }
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
        reject(err)
      }
      else{
        resolve()
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------





//                           TO BE REMOVED
// module.exports.getMaterieFromAnnoScolastico = function (annoScolastico,callback){
//     Classi.find({annoScolastico:annoScolastico},{materie:1,_id:0},function (err,results){
//         console.log("results = "+ results);
//         if(err){
//             callback(err,null)
//         }
//         else{
//             let materie = [];
//             for(let i=0;i<results.length;i++){
//                 for(let j=0;j<results[i].materie.length;j++){
//                     if(materie.indexOf(results[i].materie[j]) === -1){
//                         materie.push(results[i].materie[j])
//                     }
//                 }
//             }
//             callback(null,materie);
//         }
//     })
// };



//                        TO BE REMOVED
// module.exports.getClassiFromAnnoScolasticoMateria = function (annoScolastico,materia,callback){
//     Classi.find({annoScolastico:annoScolastico,materie:materia},{classe:1,_id:0},function (err,results){
//         if(err){
//             callback(err,null)
//         }
//         else{
//             let classi = [];
//             for(let i=0;i<results.length;i++){
//                 if(classi.indexOf(results[i].classe) === -1){
//                     classi.push(results[i].classe);
//                 }
//             }
//             callback(null,classi)
//         }
//     })
// };


//                        TO BE REMOVED
// module.exports.getSezioniFromAnnoScolasticoMateriaClasse = function (annoScolastico,materia,classe,callback){
//     Classi.find({annoScolastico:annoScolastico,classe:classe,materie:materia},{sezione:1,_id:0},function (err,results){
//         if(err){
//             callback(err,null)
//         }
//         else{
//             let sezioni =[];
//             for(let i=0;i<results.length;i++){
//                 if(sezioni.indexOf(results[i].sezione)===-1){
//                     sezioni.push(results[i].sezione);
//                 }
//             }
//             callback(null,sezioni);
//         }
//     })
// };

//                         TO BE REMOVED
// module.exports.getStudentiFromAnnoScolasticoClasseSezione = function (annoScolastico,classe,sezione,callback){
//     Classi.find({annoScolastico:annoScolastico,classe:classe,sezione:sezione},{studenti:1,_id:0},function (err,results){
//         if(err){
//             callback(err,null)
//         }
//         else{
//             let studenti = results[0].studenti;
//             callback(null,studenti);
//         }
//     })
// };



// module.exports.getClassiFromAnnoScolastico = function (annoScolastico,callback){
//     Classi.find({annoScolastico:annoScolastico},{classe:1,_id:0},function (err,results){
//         if(err){
//             callback(err,null);
//         }
//         else{
//             let classi = [];
//             for(let i=0;i<results.length;i++){
//                 if(classi.indexOf(results[i].classe) === -1){
//                     classi.push(results[i].classe);
//                 }
//             }
//             callback(null,classi)
//         }
//     })
// };
