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
