const connection = require('./databaseConnection');
const mongoose = require('mongoose');

async function dropUtenti(callback){
  mongoose.connection.db.dropCollection('Utenti',function (err,res){
    if(err){
      callback(err);
    }
    else{
      callback(null);
    }
  })
}
async function dropStudenti(callback){
  mongoose.connection.db.dropCollection('Studenti',function (err,res){
    if(err){
      //console.log("Unable to drop collection Studenti\nError : " + err);
      callback(err)
    }
    else{
      //console.log("Studenti droped successfully!");
      callback(null)
    }
  })
}

async function dropClassi(callback){
  mongoose.connection.db.dropCollection('Classi',function (err,res){
    if(err){
      console.log("Unable to drop collection Classi\nError : " + err);
      callback(err)
    }
    else{
      console.log("Classi droped successfully!");
      callback(null)
    }
  })
}
async function dropAnniScolastici(callback){
  mongoose.connection.db.dropCollection('AnniScolastici',function (err,res){
    if(err){
      console.log("Unable to drop collection AnniScolastici\nError : " + err);
      callback(err)
    }
    else{
      console.log("AnniScolastici droped successfully!");
      callback(null)
    }
  })
}
async function dropCounters(callback){
  mongoose.connection.db.dropCollection('Counters',function (err,res){
    if(err){
      console.log("Unable to drop collection Counters\nError : " + err);
      callback(err)
    }
    else{
      console.log("Counters droped successfully!");
      callback(null)
    }
  })
}
async function dropPagelle(callback){
  mongoose.connection.db.dropCollection('Pagelle',function (err,res){
    if(err){
      console.log("Unable to drop collection Pagelle\nError : " + err);
      callback(err)
    }
    else{
      console.log("Pagelle droped successfully!");
      callback(null)
    }
  })
}
async function dropPermessi(callback){
  mongoose.connection.db.dropCollection('PermessiUtente',function (err,res){
    if(err){
      console.log("Unable to drop collection PermessiUtente\nError : " + err);
      callback(err)
    }
    else{
      console.log("PermessiUtente droped successfully!");
      callback(null)
    }
  })
}

module.exports.cleanDb = function (){
  let promisesChain = [];

  let dropUtentiPromise = new Promise(function(resolve, reject) {
    dropUtenti(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
  let dropStudentiPromise = new Promise(function(resolve, reject) {
    dropStudenti(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
  let dropClassiPromise = new Promise(function(resolve, reject) {
    dropClassi(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
  let dropAnniScolasticiPromise = new Promise(function(resolve, reject) {
    dropAnniScolastici(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
  let dropCountersPromise = new Promise(function(resolve, reject) {
    dropCounters(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
  let dropPagellePromise = new Promise(function(resolve, reject) {
    dropPagelle(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });
  let dropPermessiPromise = new Promise(function(resolve, reject) {
    dropPermessi(function(err){
      if(err){
        reject(err);
      }
      else{
        resolve();
      }
    });
  });

  //promisesChain.push(dropUtentiPromise);
  promisesChain.push(dropStudentiPromise);
  promisesChain.push(dropClassiPromise);
  promisesChain.push(dropAnniScolasticiPromise);
  promisesChain.push(dropCountersPromise);
  promisesChain.push(dropPagellePromise);
  promisesChain.push(dropPermessiPromise);

  // Promise.all(promisesChain).then(()=>{
  //   callback(null);
  // },err=>{
  //   callback(err);
  // });
  return Promise.all(promisesChain)
}
