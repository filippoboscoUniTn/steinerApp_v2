"use strict";

//------------------------------- NODE_MODULES ---------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bCrypt = require('bcryptjs');
const util = require('util')
//--------------------------------- /END ---------------------------------------


//------------------------------- MY MODULES -----------------------------------
const dbConnection = require('../modules/databaseConnection');
const rounds = 10;
//-------------------------------- /END ----------------------------------------




//------------------------------- UTENTI  MODEL --------------------------------
let userSchema = new Schema({
  nome : String,
  cognome : String,
  email : String,
  username : String,
  password : String,
  authorization:{
    type:String,
    enum:['ADMIN','TEACHER'],
    default:'TEACHER'
  },
  status :{
    type:String,
    enum:['PENDING','ACCEPTED'],
    default:'PENDING'
  }
},{collection:'Utenti'});

userSchema.methods.insertUser = function (){
  let newUser = this;
  return new Promise(function(resolve, reject) {
    bCrypt.genSalt(rounds).then(salt=>{ return bCrypt.hash(newUser.password,salt)})
    .then(hash=>{
      newUser.password = hash;
      return newUser.save() })
      .then(user=>{
        resolve()
      })
      .catch(err=>{
        reject(err)
      })
    });
  }

let Utenti = mongoose.model('Utenti',userSchema);

module.exports = Utenti;
//-------------------------------- /END ----------------------------------------


//-------------------------------- GET QUERIES ---------------------------------
module.exports.getUserByUsername = username=>{
  return new Promise(function(resolve, reject) {
    Utenti.find({username:username},function(err,res){
      if(err){
        reject(err)
      }
      else{
        resolve(res[0])
      }
    })
  });
}
module.exports.getUserById = id=>{
  return new Promise(function(resolve, reject) {
    Utenti.find({_id:id},function(err,res){
      if(err){
        reject(err)
      }
      else{
        resolve(res[0])
      }
    })
  });
}
module.exports.getUserForDeserialize = function(id,callback){
  Utenti.findOne({_id:id},function(err,res){
    if(err){
      callback(null,err)
    }
    else{
      callback(null,res)
    }
  })
}
module.exports.getTeachers = ()=>{
  return new Promise(function(resolve, reject) {
    Utenti.find({status:'ACCEPTED',authorization:"TEACHER"},{nome:1,cognome:1,_id:1},function(err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results);
      }
    })
  });
}
module.exports.getAdmins = ()=>{
  return new Promise(function(resolve, reject) {
    Utenti.find({status:'ACCEPTED',authorization:"ADMIN"},{nome:1,cognome:1,_id:1},function(err,results){
      if(err){
        reject(err)
      }
      else{
        resolve(results);
      }
    })
  });
}
//-------------------------------- /END ----------------------------------------


//------------------------------ UPDATE QUERIES --------------------------------

//-------------------------------- /END ----------------------------------------


//------------------------------ DELETE QUERIES --------------------------------

//-------------------------------- /END ----------------------------------------


//------------------------------ MISCELLANEOUS ---------------------------------
//Compares input password and user's password from the database
module.exports.comparePasswords = (passwordToTest,userPassword)=>{
  return new Promise(function(resolve, reject) {
    bCrypt.compare(passwordToTest,userPassword,function(err,isMatch){
      if(err){
        reject(err)
      }
      else{
        resolve(isMatch)
      }
    })
  });
};
//-------------------------------- /END ----------------------------------------
