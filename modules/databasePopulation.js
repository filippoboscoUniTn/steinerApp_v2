"use strict";
const util = require("util")
//--------------------------------- MODULI -------------------------------------
const app = require('../app')
const dbConnection = require('./databaseConnection')
const dbClean = require('./databaseCleanup')
//-------------------------------- MODELLI -------------------------------------
const AutoIncrement = require('../models/autoIncrement');
const AnniScolastici = require('../models/anniScolastici');
const Classi = require('../models/classi');
const Pagelle = require('../models/pagelle');
const PermessiUtente = require('../models/permessiUtente');
const Studenti = require('../models/studenti');
const Utenti = require('../models/utenti');

function populateCunters(counters){
  let promises = counters.map(v => new AutoIncrement(v).save())
  return Promise.all(promises)
}
function populateAnniScolastici(anni){
  let promises = anni.map(v => new AnniScolastici(v).save())
  return Promise.all(promises)
}
function populateClassi(classi){
  let promises = classi.map(v => new Classi(v).save())
  return Promise.all(promises)
}
function populatePagelle(pagelle){
  let promises = pagelle.map(v => new Pagelle(v).save())
  return Promise.all(promises)
}
function populatePermessiUtente(permessi){
  let promises = permessi.map(v => new PermessiUtente(v).save())
  return Promise.all(promises)
}
function populateStudenti(students){
  let promises = students.map(v => new Studenti(v).save())
  return Promise.all(promises)
}
function inserStudenti(students){
  let promises = students.map(v=>{ Studenti.insertMany(v)})
  return Promise.all(promises)
}
function populateUtenti(users){
  let newUsers = users.map(v=> new Utenti(v));
  let promises = newUsers.map(nu=> nu.insertUser())
  return Promise.all(promises)
}
function insertPagelle(pagelle){
  let promises = pagelle.map(v=> new Pagelle(v).save())
  return Promise.all(promises)
}
function randomElementFrom(nElementi,pool){
  let res = [];
  for(let i=0;(i<nElementi || i > pool.length);i++){
    let random_index = Math.floor(Math.random() * pool.length)
    if(res.indexOf(pool[random_index]) === -1){
      res.push(pool[random_index])
    }
    else{
      i--;
    }
  }

  if(res.length === 1){
    return res[0]
  }
  else{
    return res;
  }
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function generateStudente(config){
  let newStudente = {
    id:config.seq,
    nome : randomElementFrom(1,config.pool_nomi),
    cognome : randomElementFrom(1,config.pool_cognomi),
    luogoNascita : randomElementFrom(1,config.pool_citta),
    dataNascita : randomDate(config.min_data,config.max_data),
    residenza:{
      comune : randomElementFrom(1,config.pool_citta),
      cap : Math.floor(config.max_cap + Math.random()*(config.max_cap - config.min_cap)),
      indirizzo:{
        via : randomElementFrom(1,config.pool_strade),
        numeroCivico : Math.floor(config.max_civ + Math.random()*(config.max_civ - config.min_civ))
      }
    }
  }
  config.seq ++;
  return newStudente
}
function generateClass(anno,classe,sezione,config){
  let newClasse = {
    annoScolastico:anno,
    classe:classe,
    sezione:sezione,
    materie:randomElementFrom(6,config.pool_materie),
    maestroClasse:{
      nome:randomElementFrom(1,config.pool_nomi),
      cognome:randomElementFrom(1,config.pool_cognomi)
    },
    studenti:[]
  }
  return newClasse
}
function generatePagella(anno,classe,sezione,idStudente,materia){
  let newPagella = {
    idStudente:idStudente,
    materia:materia,
    classe:classe,
    sezione:sezione,
    annoScolastico:anno,
    primoSemestre:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    secondoSemestre:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
  return newPagella
}
  /*
    1) Popolazione contatori
    2) Popolazione Utenti
    3) Popolazione Studenti
    4) Popolazione Anni Scolastici
    5) Popolazione Classi

    6) Popolazione Permessi
    7) Popolazione Pagelle
  */
function generateSampleDb(){

  let sampleConfig = {
     seq: 0,
     pool_ids : 0,
     pool_anni:["2017/18","2018/19","2019/20"],
     pool_sezioni:["A","B"],
     pool_materie:["Tedesco","Italiano","Geografia","Storia","Epoca","Euritmia","Attività Fisica","Arte","Lavoro manuale","Inglese","Musica","Matematica","Scienze","Chimica","Fisica"],
     pool_nomi:["Agnese","Agostino","Aimeè","Alan","Belinda","Bella","Ben","Benedetto","Clotilde","Concetta","Consolata","Contessa","Cora","Donald","Donar","Donata","Eleonora","Eletta","Elettra","Fiammetta","Filiberto","Kamar","Keith","Ken","Reed","Regina","Remigio","Remo","Spartaco","Speranza","Stanislao","Stefania"],
     pool_cognomi:["Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Gallo","Conti","De Luca","Mancini","Costa","Giordano","Rizzo","Lombardi","Moretti","Barbieri","Fontana","Santoro","Mariani","Rinaldi","Caruso","Ferrara","Galli","Martini","Leone","Longo","Gentile","Martinelli","Vitale","Lombardo","Serra","Coppola","De Santis","D'angelo","Marchetti","Parisi","Villa","Conte","Ferraro","Ferri","Fabbri","Bianco","Marini","Grasso","Valentini","Messina","Sala","De Angelis","Gatti","Pellegrini","Palumbo","Sanna","Farina","Rizzi","Monti","Cattaneo","Morelli","Amato","Silvestri","Mazza","Testa","Grassi","Pellegrino","Carbone","Giuliani"],
     pool_strade:["Roma","Milano","Guglielmo Marconi","Massimo Dalema","Garibaldi","Diaz","Venezia","3 Novembre","XX Febbraio","Trieste","Gramsci","Giuseppe Verdi"],
     pool_citta:["Trento","Rovereto","Borgo","Levico","Brenta","Calceranica","Vipiteno","Bassano del grappa"],
     max_cap:38299,
     min_cap:38122,
     max_civ:100,
     min_civ:1,
     max_data:new Date(2012, 0, 1),
     min_data:new Date(2000, 0, 1),
  }
  let samples = []

    //----------------------- CREAZIONE ANNO SCOLASTICO ------------------------
    sampleConfig.pool_anni.forEach((v_anno,i_anno,a_anno)=>{

      let newSample = {
        annoScolastico : {nome:v_anno},
        classi : [],
        pagelle : [],
        studenti:[]
      }
      for(let classe_i=1;classe_i<=8;classe_i++){

        sampleConfig.pool_sezioni.forEach((v_sezione,i_sezione,a_sezione)=>{

          let newClasse = generateClass(v_anno,classe_i,v_sezione,sampleConfig)
          for(let studente_i=0;studente_i<15;studente_i++){
            let newStudente = generateStudente(sampleConfig)
            for(let materia_i=0;materia_i<newClasse.materie.length;materia_i++){
              let newPagella = generatePagella(v_anno,classe_i,v_sezione,newStudente.id,newClasse.materie[materia_i]);
              newSample.pagelle.push(newPagella);
            }
            newClasse.studenti.push(newStudente.id)
            newSample.studenti.push(newStudente);
          }
          newSample.classi.push(newClasse);
        })

      }

      samples.push(newSample);
    })
    //----------------------------- END ----------------------------------------
    samples.push([{_id:"studentCounter",seq:sampleConfig.seq}])
    return samples;
}








function popDb(){
  return new Promise(async function(resolve, reject) {
    let counters = [{_id:"studentCounter",seq:10}];
    let users = [{
        nome : "admin",
        cognome : "admin",
        email : "admin@server.com",
        username : "admin",
        password : "admin",
        authorization:'ADMIN',
        status :'ACCEPTED'
    },
    {
      nome : "alessio",
      cognome : "zanella",
      email : "alessio.zll@server.com",
      username : "alessio",
      password : "alessio",
      authorization:'TEACHER',
      status :'ACCEPTED'
    }]
    let permessiUtenti = [
    //permessi admin
    {
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2017/18",
      materia:"Storia",
      classi:[1,2,3,4]
    },{
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2017/18",
      materia:"Inglese",
      classi:[3,4]

    },{
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2017/18",
      materia:"Fisica",
      classi:[7,8]

    },{
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2018/19",
      materia:"Storia",
      classi:[2,3,4,5]

    },{
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2018/19",
      materia:"Inglese",
      classi:[4,5]

    },{
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2018/19",
      materia:"Fisica",
      classi:[8]

    },{
      idUtente:"5c07e45c6d12561ee6916fdb",
      annoScolastico:"2018/19",
      materia:"Italiano",
      classi:[1,3,2]
    },
    //permessi alessio-zanella
    {
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2017/18",
      materia:"Storia",
      classi:[1,2,3,4]
    },{
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2017/18",
      materia:"Inglese",
      classi:[3,4]

    },{
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2017/18",
      materia:"Fisica",
      classi:[7,8]

    },{
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2018/19",
      materia:"Storia",
      classi:[2,3,4,5]

    },{
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2018/19",
      materia:"Inglese",
      classi:[4,5]

    },{
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2018/19",
      materia:"Fisica",
      classi:[8]

    },{
      idUtente:"5c07e45c6d12561ee6916fdc",
      annoScolastico:"2018/19",
      materia:"Italiano",
      classi:[1,3,2]
    }]
    let permessiPromise = permessiUtenti.map(v=>new PermessiUtente(v).save());
    for(let i=0;i<users.length;i++){
      let newUser = new Utenti(users[i]);
      const res = await newUser.insertUser();
      console.log("res = " + res._id);
      if(i==0){
        for(let k=0;k<permessiUtenti.length;k++){
          if(permessiUtenti[k].idUtente === "5c07e45c6d12561ee6916fdb"){
            permessiUtenti[k].idUtente = String(res._id);
            let newPermesso = new PermessiUtente(permessiUtenti[k]);
            const np = await newPermesso.save();
          }
        }
      }
      else {
        for(let k=0;k<permessiUtenti.length;k++){
          if(permessiUtenti[k].idUtente === "5c07e45c6d12561ee6916fdc"){
            permessiUtenti[k].idUtente = res._id;
            let newPermesso = new PermessiUtente(permessiUtenti[k]);
            const np = await newPermesso.save();
          }
      }
    }

    }
    let samples = generateSampleDb();

    let classiChain = [];
    let studentChain = [];
    let pagelleChain = [];

    for(let i=0;i<samples.length-1;i++){
      classiChain.push(populateClassi(samples[i].classi))
      studentChain.push(inserStudenti(samples[i].studenti))
      pagelleChain.push(insertPagelle(samples[i].pagelle))
    }

    Promise.all([populateAnniScolastici([samples[0].annoScolastico,samples[1].annoScolastico,samples[2].annoScolastico]),
                          populateCunters(samples[samples.length-1]),
                          Promise.all(classiChain),
                          Promise.all(studentChain),
                          Promise.all(pagelleChain)
                        ]).then(()=>{
                          console.log("promise.all finished");
                          resolve()
                        }).catch(err=>{
                          console.log("err = " + err);
                          reject(err)
                        })

  })
}

module.exports = {popDb}







//----------------------------------- RITAGLI ----------------------------------

//------------------------------------ END -------------------------------------
