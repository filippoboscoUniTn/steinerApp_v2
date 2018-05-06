"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports.getAnniScolasticiUtente = function (nome,cognome){
    PermessiUtente.find({nome:nome,cognome:cognome},{annoScolastico:1,_id:0},function (err,results){
        if(err){
            callback(err,null);
        }
        else{
            callback(null,results);
        }
    })
};