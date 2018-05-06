"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoInc = require('./autoIncrement');
const dbConnection = require('../modules/databaseConnection');

const util = require('util');

let studentiSchema = new Schema({
    id:{
        type: Number,
        require: true
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
        default:true}
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
