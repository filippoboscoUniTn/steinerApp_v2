"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let dbConnection = require('../modules/databaseConnection');
let bCrypt = require('bcryptjs');
let salt = 10;


let userSchema = new Schema({
    name : String,
    surname : String,
    email : String,
    username : String,
    password : String,
    authorization:{
        type:String,
        enum:['ADMIN','TEACHER'],
        default:'TEACHER'
    },
    permissions : [ {as:String, permessi:[ {subject:String,classes:[Number]} ] } ],
    status :{
        type:String,
        enum:['PENDING','ACCEPTED'],
        default:'PENDING'
    }
});

userSchema.methods.insertUser = function(user,callback){
    //Generate hash's salt
    bCrypt.genSalt(salt,function(err,salt){
        //error generating salt
        if(err){
            callback(err,null,null)
        }
        //hash user's password with generated salt
        bCrypt.hash(user.password,salt,function(err,hash){
            //error generating salt
            if(err){
                callback(err,null,null)
            }
            user.password = hash;
            //save user to database
            user.save(function(err,user,numAffected){
                //error saving user to database
                if(err){
                    callback(err,null,null);
                }
                callback(null,user,numAffected);
            })
        })
    })
};

let Users = mongoose.model('User',userSchema);
module.exports = Users;

//Find a user given its name
module.exports.findByName = function (username,callback){
    Users.findOne({username:username},function (err,user){
        if(err){
            callback(err,null)
        }
        else{
            //user might be null, checking is done in invoking function
            callback(null,user)
        }
    })
};

//Compares input password (password) and user's password from the database
module.exports.comparePasswords = function (password,userPassword,callback){
    bCrypt.compare(password,userPassword,function(err,isMatch){
        if(err){
            callback(err,null)
        }
        else{
            callback(null,isMatch)
        }
    })
};

//Finds a user given its ID
module.exports.findUserById = function(id,callback){
    Users.findById(id,callback)
};