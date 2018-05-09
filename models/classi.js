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