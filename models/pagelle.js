"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

pagelleSchema.index({idStudente,materia,classe,sezione,annoScolastico},{unique:true});

let Pagelle = mongoose.model(pagelleSchema);

module.exports = Pagelle;