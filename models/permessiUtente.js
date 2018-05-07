"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const util = require('util');

const dbConnection = require('../modules/databaseConnection');
const utenti = require('./utenti');

let permessiUtenteSchema = new Schema ({
    nome : String,
    cognome : String,
    annoScolastico : String,
    permessi : [
        {
            materia : String,
            classi : [ Number ]
        }
    ]
},{collection:'PermessiUtente'});

let PermessiUtente = mongoose.model('PermessiUtente', permessiUtenteSchema);

module.exports = PermessiUtente;

module.exports.getAnniScolasticiUtente = function (nome,cognome,callback){
    PermessiUtente.find({nome:nome,cognome:cognome},{annoScolastico:1,_id:0},function (err,results){
        if(err){
            callback(err,null);
        }
        else{
            let anni = [];
            for(let i=0;i<results.length;i++){
                let annoTmp = {nome:results[i].annoScolastico};
                anni.push(annoTmp)
            }
            callback(null,anni);
        }
    })
};
module.exports.getMaterieFromAnnoScolastico = function (nome,cognome,annoScolastico,callback) {
    PermessiUtente.find({nome:nome,cognome:cognome,annoScolastico:annoScolastico},{permessi:1,_id:0},function (err,permessi){
        if(err){
            callback(err,null)
        }
        let materie = [];
        for(let i=0;i<permessi[0].permessi.length;i++){
            materie.push(permessi[0].permessi[i].materia)
        }
        console.log("permessi = " + permessi);
        console.log("materie = " + (materie));
        callback(null,materie);
    })
};
module.exports.getClassiFromAnnoScolasticoMateria = function (nome,cognome,annoScolastico,materia,callback){
    PermessiUtente.find({nome:nome,cognome:cognome,annoScolastico:annoScolastico,'permessi.materia':materia},{'permessi.$':1,_id:0},function (err,results){
        if(err){
            callback(err,null)
        }
        else{
            let classi = [];
            for(let i=0;i<results[0].permessi.length;i++){
               for(let j=0;j<results[0].permessi[i].classi.length;j++){
                   classi.push(results[0].permessi[i].classi[j]);
               }
            }
            callback(null,classi)
        }
    })
};