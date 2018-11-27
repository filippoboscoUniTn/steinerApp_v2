"use strict";
const express = require('express');

//Models
const Classi = require('../models/classi');
const PermessiUtente = require('../models/permessiUtente');
const Studenti = require('../models/studenti');
const Pagelle = require('../models/pagelle');

//Modules
const utilityFunctions = require('../modules/utilityFunctions');

const util = require('util');

let router = express.Router();

router.post('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia/:classe([1-8])/:sezione/:nome/:cognome/:id/:semestre',function (req,res){
  console.log("hi")
    let nuovaPagella = req.body.content;
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    let sezione = req.params.sezione;
    let semestre = req.params.semestre;
    let materia = req.params.materia;
    let idStudente = req.params.id;
    console.log(nuovaPagella + " " + annoScolastico+ " " +classe+ " " +sezione+ " " +semestre+ " " +materia+ " " +idStudente)
    Pagelle.updatePagella(annoScolastico,classe,sezione,semestre,materia,idStudente,nuovaPagella)
      .then(()=>{
        req.session.successMsg = "Pagella salvata con successo!"
        res.send('ok');
      })
      .catch(err=>{
        req.session.errorMsg = "Errore durante il salvataggio della pagella : " + err;
        res.send('err');
      })
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia/:classe([1-8])/:sezione/:nome/:cognome/:id',function(req,res,next) {
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let classe = req.params.classe;
    let sezione = req.params.sezione;
    let studente = {
        nome:req.params.nome,
        cognome:req.params.cognome,
        id : req.params.id
    };
    Pagelle.getPagellaFromStudente(annoScolastico,classe,sezione,materia,studente.id)
      .then(pagella=>{
        let pagellaPrimoSemestre = "";
        let pagellaSecondoSemestre = "";
        if( typeof pagella.primoSemestre !== 'undefined'){
            pagellaPrimoSemestre = pagella.primoSemestre;
        }
        if(typeof pagella.secondoSemestre !== 'undefined'){
            pagellaSecondoSemestre = pagella.secondoSemestre;
        }
        res.render('./areaUtente/pagelle',{layout:'authLayout',title:'Pagelle',subtitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"'>"+'Classi'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"/"+classe+"'>"+'Sezioni'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"/"+classe+"/"+sezione+"'>"+'Studenti'+"</a>",annoScolastico:annoScolastico,materia:materia,classe:classe,sezione:sezione,studente:studente,pagellaPrimoSemestre:pagellaPrimoSemestre,pagellaSecondoSemestre:pagellaSecondoSemestre
        })
      })
      .catch(err=>{
        next(err);
      })
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia/:classe([1-8])/:sezione',function (req,res,next){
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let classe = Number(req.params.classe);
    let sezione = req.params.sezione;

    Classi.getStudentiFromAnnoScolasticoClasseSezione(annoScolastico,classe,sezione)
      .then(idStudenti=>{ return Studenti.getInfoStudentiById(idStudenti) })
      .then((studenti)=>{
        res.render('./areaUtente/studenti',{layout:'authLayout',title:'Studenti',
                                            subtitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"'>"+'Classi'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"/"+classe+"'>"+'Sezioni'+"</a>",
                                            annoScolastico:annoScolastico,
                                            materia:materia,
                                            classe:classe,
                                            sezione:sezione,
                                            studenti:studenti
        })
      })
      .catch(err=>{
        next(err)
      })
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia/:classe([1-8]$)',function (req,res,next){
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let classe = Number(req.params.classe);

    Classi.getSezioniFromAnnoScolasticoMateriaClasse(annoScolastico,classe,materia)
      .then(sezioni=>{
        if(sezioni.length <= 1){ //Per la classe esiste una sola sezione, redirect alla pagina degli studenti
            res.redirect('/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezioni[0]) //TBI
        }
        else{
            res.render('./areaUtente/sezioni',{layout:'authLayout',title:'Sezioni',subtitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"'>"+'Classi'+"</a>",annoScolastico:annoScolastico,materia:materia,classe:classe,sezioni:sezioni})
        }
      })
      .catch(err=>{
        next(err)
      })
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia',async function (req,res,next){
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let isAdmin = false;
    if(req.user.authorization === 'ADMIN'){ //Controlla se l'utente è ADMIN
        isAdmin = true;
    }
    try{
      const classi = await Classi.getClassiFromAnnoScolasticoMateria(annoScolastico,materia);
      if(isAdmin){
        res.render('./areaUtente/classi',{layout:'authLayout',title:'Classi',subtitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>",titoloSezione:'Classi',annoScolastico:annoScolastico,materia:materia,classi:classi})
      }
      else{
        const classiPermesso = await PermessiUtente.getClassiFromAnnoScolasticoMateria(nome,cognome,annoScolastico,materia)
        let classiAccessibili = utilityFunctions.intersect(classiPermesso,classi);
        res.render('./areaUtente/classi',{layout:'authLayout',title:'Classi',subtitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+materia+"</a>",titoloSezione:'Classi',annoScolastico:annoScolastico,materia:materia,classi:classi})
      }
    }
    catch(err){
      next(err);
    }
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',async function (req,res,next){
    let annoScolastico = req.params.as;
    let isAdmin = false;
    if(req.user.authorization === 'ADMIN'){
        isAdmin = true;
    }
    try{
      const materieAnnoScolastico = await Classi.getMaterieFromAnnoScolastico(annoScolastico);
      if(isAdmin){
        res.render('./areaUtente/materie',{layout:'authLayout',title:'Materie',subtitle:"<a href='\\index '>"+'Anni Scolastici '+"</a>",titoloSezione:'Materie',materie:materieAnnoScolastico,annoScolastico:annoScolastico});
      }
      else{
        const materiePermesso = PermessiUtente.getMaterieFromAnnoScolastico(req.user.nome,req.user.cognome,annoScolastico)
        let materieAccessibili = utilityFunctions.intersect(materiePermesso,materieAnnoScolastico);
        res.render('./areaUtente/materie',{layout:'authLayout',title:'Materie',subtitle:"<a href='\\index '>"+'Anni Scolastici '+"</a>",titoloSezione:'Materie',materie:materieAccessibili,annoScolastico:annoScolastico});
      }
    }
    catch(err){
      next(err)
    }
});

module.exports = router;
