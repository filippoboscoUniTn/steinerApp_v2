const connection = require('./databaseConnection');
const mongoose = require('mongoose');

const AnniScolastici = require("../models/anniScolastici")
const AutoIncrement = require("../models/autoIncrement")
const Classi = require("../models/classi")
const Pagelle = require("../models/pagelle")
const PermessiUtente = require("../models/permessiUtente")
const Studenti = require("../models/studenti")
const Utenti = require("../models/utenti")



module.exports.dropCollections = ()=>{
  return Promise.all([AnniScolastici.collection.drop(),AutoIncrement.collection.drop(),Classi.collection.drop(),Pagelle.collection.drop(),PermessiUtente.collection.drop(),Studenti.collection.drop(),Utenti.collection.drop()])
}
