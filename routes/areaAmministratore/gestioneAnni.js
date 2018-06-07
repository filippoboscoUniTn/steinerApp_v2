"use strict";

//-------------------------------- PACKAGES ------------------------------------
const express =  require('express');
//----------------------------------- END --------------------------------------


//--------------------------------- MODELLI ------------------------------------
const AnniScolastici = require('../../models/anniScolastici');
const Classi = require('../../models/classi');
//----------------------------------- END --------------------------------------


//--------------------------------- MODULI -------------------------------------
const util = require('util');
//----------------------------------- END --------------------------------------


//---------------------- DICHIARAZIONI VARIABILI -------------------------------
let router = express.Router();
//----------------------------------- END --------------------------------------



//-------------------- HANDLERS RICHIESTE ASINCRONE AJAX -----------------------
router.get('/getMaterie/:as(20[0-9][0-9]/[0-9][0-9])/:classe([0-9])',function(req,res,next){
  let annoScolastico = req.params.as;
  let classe = req.params.classe;
  Classi.getMaterieFromClasseAndAnnoScolastico(annoScolastico,classe,function (err,materie){
    if(err){
      res.send(err);
    }
    else{
      res.send(materie);
    }
  })
});
//----------------------------------- END --------------------------------------



//------------------------ HANDLERS MODIFICHE STUDENTE -------------------------
router.post('/creaNuovoStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',function (req,res,next){
    console.log(req.url);
    res.send("hello from " + req.url);
});
router.post('/modificaStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:nome/:cognome/:id',function(req,res){
  console.log(req.url);
  res.send("hello from " + req.url);
})
router.post('/eliminaStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:nome/:cognome/:id',function(req,res){
  console.log(req.url);
  res.send("hello from " + req.url)
})
//----------------------------------- END --------------------------------------



//------------------------- HANDLERS MODIFICHE SEZIONE -------------------------
router.post('/creaNuovaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function (req,res,next){
    console.log(req.url);
    res.send("hello from " + req.url);
});
router.post('/modificaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',function(req,res){
  console.log(req.url);
  res.send("hello from " + req.url);
})
router.post('/eliminaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',function(req,res){
  console.log(req.url);
  res.send("hello from " + req.url)
})
//----------------------------------- END --------------------------------------



//-------------------------- HANDLERS MODIFICHE CLASSE -------------------------
router.post('/creaNuovaClasse/:as(20[0-9][0-9]/[0-9][0-9])',function (req,res,next){
    console.log(req.url);
    res.send("hello from " + req.url);
});
router.post('/modificaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function(req,res){
  console.log(req.url);
  res.send("hello from " + req.url);
})
router.post('/eliminaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function(req,res){
  console.log(req.url);
  res.send("hello from " + req.url)
})
//----------------------------------- END --------------------------------------



//---------------------- HANDLERS MODIFICHE ANNO SCOLASTICO --------------------
router.post('/creaNuovoAnnoScolastico',function (req,res,next){
  console.log(req.url);
  res.send("Hello from " + req.url);
})
router.post('/modificaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function(req,res,next){
    console.log(req.url);
    res.send("Hello from " + req.url);
});
router.post('/eliminaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function (req,res,next){
    console.log(req.url);
    res.send("Hello from " + req.url);
});
//----------------------------------- END --------------------------------------





//------------------------- PAGINE AREA AMMINISTRATORE -------------------------


  //---------------------------- GESTIONE STUDENTI -----------------------------
  router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',function(req,res,next){
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    let sezione = req.params.sezione;
    Classi.getStudentiFromAnnoScolasticoAndClasseAndSezione(annoScolastico,classe,sezione,function (err,studenti){
      if(err){
        next(err);
      }
      else{
        res.render('./areaAmministratore/gestioneDB/gestioneStudenti',{layout:'authLayout',title:'Gestione Studenti',subTitle:'Gestione Studenti Classe ' + classe + ' Sezione ' +sezione ,annoScolastico:annoScolastico,classe:classe,sezione:sezione,studenti:studenti})
      }
    })
  });
  //----------------------------------- END ------------------------------------


  //----------------------------- GESTIONE SEZIONI -----------------------------
  router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function(req,res,next){
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    Classi.getSezioniFromAnnoScolasticoAndClasse(annoScolastico,classe,function (err,sezioni){
        if(err){
          next(err);
        }
        else{
          res.render('./areaAmministratore/gestioneDB/gestioneSezioni',{layout:'authLayout',title:'Gestione Sezioni',subTitle:'Gestione Sezioni Classe ' + classe ,annoScolastico:annoScolastico,classe:classe,sezioni:sezioni})
        }
    })
  });
  //----------------------------------- END ------------------------------------


  //------------------------------ GESTIONE CLASSI -----------------------------
  router.get('/:as(20[0-9][0-9]/[0-9][0-9]$)',function(req,res,next){
      let annoScolastico = req.params.as;
      Classi.getClassiFromAnnoScolastico(annoScolastico,function(err,classi){
          if(err){
              next(err);
          }
          else{
              res.render('./areaAmministratore/gestioneDB/gestioneClassi',{layout:'authLayout',title:'Gestione Classi',subTitle:'Gestione Classi '+ annoScolastico,annoScolastico:annoScolastico,classi:classi})
          }
      })
  });
  //----------------------------------- END ------------------------------------


  //------------------------- GESTIONE ANNI SCOLASTICI -------------------------
  router.get('/',function(req,res,next){
      AnniScolastici.getAnniScolastici(function(err,anniScolastici){
          if(err){
              next(err)
          }
          else{
              res.render('./areaAmministratore/gestioneDB/gestioneAnni',{layout:'authLayout',title:'Gestione Anni Scolastici',subTitle:'Gestione Anni Scolastici',anniScolastici:anniScolastici})
          }
      })
  });
  //----------------------------------- END ------------------------------------


//----------------------------------- END --------------------------------------





//---------------------------- EXPORT DEL MODULO -------------------------------
module.exports = router;
//----------------------------------- END --------------------------------------
