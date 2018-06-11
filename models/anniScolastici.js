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
module.exports.annoGiaEsistente = function (anno,callback){
  AnniScolastici.find({nome:anno},function(err,results){
    if(err){
      callback(err,null);
    }
    else{
      console.log("results = " + results)
      if(results.length !== 0){
        callback(null,true);
      }
      else{
        callback(null,false);
      }
    }
  })
};
