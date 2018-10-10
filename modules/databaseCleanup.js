const connection = require('./databaseConnection');
const mongoose = require('mongoose');

module.exports.dropStudenti = function (){
  mongoose.connection.db.dropCollection('Studenti',function (err,res){
    if(err){
      console.log("Unable to drop collection Studenti\nError : " + err);
    }
    else{
      console.log("Studenti droped successfully!");
    }
  })
}
module.exports.dropClassi = function (){
  mongoose.connection.db.dropCollection('Classi',function (err,res){
    if(err){
      console.log("Unable to drop collection Classi\nError : " + err);
    }
    else{
      console.log("Classi droped successfully!");
    }
  })
}
module.exports.dropAnniScolastici = function (){
  mongoose.connection.db.dropCollection('AnniScolastici',function (err,res){
    if(err){
      console.log("Unable to drop collection AnniScolastici\nError : " + err);
    }
    else{
      console.log("AnniScolastici droped successfully!");
    }
  })
}
module.exports.dropCounters = function (){
  mongoose.connection.db.dropCollection('Counters',function (err,res){
    if(err){
      console.log("Unable to drop collection Counters\nError : " + err);
    }
    else{
      console.log("Counters droped successfully!");
    }
  })
}
module.exports.dropPagelle = function (){
  mongoose.connection.db.dropCollection('Pagelle',function (err,res){
    if(err){
      console.log("Unable to drop collection Pagelle\nError : " + err);
    }
    else{
      console.log("Pagelle droped successfully!");
    }
  })
}
module.exports.dropPermessi = function (){
  mongoose.connection.db.dropCollection('PermessiUtente',function (err,res){
    if(err){
      console.log("Unable to drop collection PermessiUtente\nError : " + err);
    }
    else{
      console.log("PermessiUtente droped successfully!");
    }
  })
}
module.exports.dropUtenti = function (){
  mongoose.connection.db.dropCollection('Utenti',function (err,res){
    if(err){
      console.log("Unable to drop collection Utenti\nError : " + err);
    }
    else{
      console.log("Utenti droped successfully!");
    }
  })
}
