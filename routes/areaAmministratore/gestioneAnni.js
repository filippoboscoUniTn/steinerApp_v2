"use strict";

//-------------------------------- PACKAGES ------------------------------------
const express =  require('express');
//----------------------------------- END --------------------------------------


//--------------------------------- MODELLI ------------------------------------
const AnniScolastici = require('../../models/anniScolastici');
const Classi = require('../../models/classi');
const PermessiUtente = require('../../models/permessiUtente');
const Studenti = require('../../models/studenti');
const Pagelle = require('../../models/pagelle');
//----------------------------------- END --------------------------------------


//--------------------------------- MODULI -------------------------------------
const util = require('util');
//----------------------------------- END --------------------------------------


//---------------------- DICHIARAZIONI VARIABILI -------------------------------
let router = express.Router();
//----------------------------------- END --------------------------------------



//-------------------- HANDLERS RICHIESTE ASINCRONE AJAX -----------------------
router.get('/getInfoStudente/:idStudente$',async function(req,res,next){
    let ids = [req.params.idStudente];
    Promise.all(Studenti.getInfoStudentiById(ids)).then(results=>{
      res.send(results[0])
    })
    .catch(err=>{
      res.send(err)
    })
})
router.get('/getMaterie/:as(20[0-9][0-9]/[0-9][0-9])/:classe([0-9])$',async function(req,res,next){
  let annoScolastico = req.params.as;
  let classe = req.params.classe;
  Classi.getMaterieFromClasseAndAnnoScolastico(annoScolastico,classe)
    .then(materie=>{
      res.send(materie)
    })
    .catch(err=>{
      res.send(err)
    })
});
router.get('/getMaterie/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione([A-Z])$',async function (req,res,next){
  let annoScolastico = req.params.as;
  let classe = req.params.classe;
  let sezione = req.params.sezione;

  Classi.getMaterieAndMaestroFromSezioneAndClasseAndAnnoScolastico(annoScolastico,classe,sezione)
  .then(results=>{
    res.send(results);
  })
  .catch(err=>{
    res.send(err)
  })
})
//----------------------------------- END --------------------------------------



//------------------------ HANDLERS MODIFICHE STUDENTE -------------------------


  //------------------------ CREA NUOVO STUDENTE ---------------------------
  router.post('/creaNuovoStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',async function (req,res,next){
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    let sezione = req.params.sezione;
    let idStudenteSalvato;

    let new_studente = {
      nome: req.body.nomeCreaStudente,
      cognome: req.body.cognomeCreaStudente,
      ammesso: req.body.statoAmmissioneCreaStudente,
      luogoNascita: req.body.luogoNascitaCreaStudente,
      dataNascita: req.body.dataNascitaCreaStudente,
      residenza:{
        comune: req.body.comuneCreaStudente,
        cap: req.body.capCreaStudente,
        indirizzo:{
          via: req.body.viaCreaStudente,
          numeroCivico: req.body.numeroCivicoCreaStudente
        }
      }
    }
    Classi.sezioneGiaEsistente(annoScolastico,classe,sezione)
    .then(esistente=>{
      if(esistente){
        let newStudenti = new Studenti(new_studente)
        return Studenti.saveWrapper(newStudenti)
      }
      else{
        return Promise.reject(new Error("la sezione " + sezione + " della classe " + classe + " dell'anno scolastico " + annoScolastico + " non esiste."))
      }
    })
    .then(doc=>{
      idStudenteSalvato = doc.id
      return Classi.aggiungiStudente(idStudenteSalvato,annoScolastico,classe,sezione)
    })
    .then(()=>{
      return Classi.getMaterieSezione(annoScolastico,classe,sezione)
    })
    .then(materie=>{
      console.log("materie = " + materie)
      return Pagelle.popolaPagelleStudente(idStudenteSalvato,annoScolastico,classe,sezione,materie)
    })
    .then(()=>{
      req.session.successMsg = "Studente creato con successo!"
      res.redirect("/admin/gestioneAnni/"+annoScolastico+"/"+classe+"/"+sezione)
    })
    .catch(err=>{
      req.session.errorMsg = "Errore nella creazione dello/a studente/ssa : \n" + err
      res.redirect("/admin/gestioneAnni/"+annoScolastico+"/"+classe+"/"+sezione)
    })
  });
  //--------------------------------- END --------------------------------------

  //---------------------------- MODIFICA STUDENTE ------------------------------
  router.post('/modificaStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:id',async function(req,res,next){
    console.log("hello from modificha")
    let id = req.params.id

    let oldAnno = req.params.as;
    let oldClasse = req.params.classe;
    let oldSezione = req.params.sezione

    let newAnno = req.body.inizioAnnoGestioneStudente
    let newClasse = req.body.classeGestioneStudente
    let newSezione = req.body.sezioneGestioneStudente

    let modifiche = {
      id:id,
      nome: req.body.nomeGestioneStudente,
      cognome: req.body.cognomeGestioneStudente,
      ammesso: req.body.statoAmmissioneGestioneStudente,
      luogoNascita: req.body.luogoNascitaGestioneStudente,
      dataNascita: req.body.dataNascitaGestioneStudente,
      residenza:{
        comune: req.body.comuneGestioneStudente,
        cap: req.body.capGestioneStudente,
        indirizzo:{
          via: req.body.viaGestioneStudente,
          numeroCivico: req.body.numeroCivicoGestioneStudente
        }
      }
    }
    console.log(oldAnno + " " + oldClasse+ " " +oldSezione)
    console.log("modifiche = " + modifiche)
    console.log(newAnno+ " " +newClasse+ " " +newSezione)
    Classi.sezioneGiaEsistente(newAnno,newClasse,newSezione)
      .then(esistente=>{
        if(esistente){
          return Studenti.updateStudente(id,modifiche)
        }
        else{
          return Promise.reject(new Error("la sezione " + newSezione + " della classe " + newClasse + " dell'anno scolastico " + newAnno + " non esiste."))
        }
      })
      .then(Classi.removeStudente(id,oldAnno,oldClasse,oldSezione))
      .then(Classi.aggiungiStudente(id,newAnno,newClasse,newSezione))
      .then(Pagelle.updateClasseStudente(id,newAnno,newClasse,newSezione,oldAnno,oldClasse,oldSezione))
      .then(()=>{
        req.session.successMsg = "Studente modificato con successo!";
        res.redirect("/admin/gestioneAnni/" +oldAnno+"/"+oldClasse+"/"+oldSezione)
      })
      .catch(err=>{
        req.session.errorMsg = "Impossibile modificare lo/la studente/ssa : " + err.message;
        res.redirect("/admin/gestioneAnni/" +oldAnno+"/"+oldClasse+"/"+oldSezione)
      })
  })
  //--------------------------------- END --------------------------------------

  //--------------------------- ELIMINA STUDENTE --------------------------------
  router.post('/eliminaStudente/:id',function(req,res,next){
    let id = req.params.id;

    let annoScolastico = req.body.anno;
    let classe = req.body.classe;
    let sezione = req.body.sezione;

    console.log("id = " +id)
    Classi.removeStudente(id,annoScolastico,classe,sezione)
      .then(Studenti.removeStudente(id))
      .then(Pagelle.deletePagelleStudente(id))
      .then(()=>{
        req.session.successMsg = "Studente Eliminato con successo!";
        res.send("ok");
      })
      .catch(err=>{
        throw err
        req.session.errorMsg = "Errore nell'eliminazione dello studente!\n"+ err;
        res.send("err");
      })
  })
  //--------------------------------- END --------------------------------------

//----------------------------------- END --------------------------------------



//------------------------- HANDLERS MODIFICHE SEZIONE -------------------------

  //------------------------ CREAZIONE NUOVA SEZIONE ---------------------------
  router.post('/creaNuovaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',async function (req,res,next){

      let newSezione = {
        annoScolastico: req.body.inizioAnnoCreaSezione,
        classe:req.body.classeCreaSezione,
        sezione:req.body.sezioneCreaSezione,
        materie:req.body.materieCreaSezione,
        maestroClasse:{
          nome: req.body.nomeMaestroCreaSezione,
          cognome: req.body.cognomeMaestroCreaSezione
        },
        studenti:[]
      }
      console.log(newSezione)
      Classi.sezioneGiaEsistente(newSezione.annoScolastico,newSezione.classe,newSezione.sezione)
            .then(esistente=>{
              if(esistente){
                console.log("sezione esistente")
                let err = new Error("la sezione " + newSezione.sezione + " esiste già per la classe " + newSezione.classe + " dell'anno scolastico " + newSezione.annoScolastico)
                return Promise.reject(err);
              }
              else{
                return AnniScolastici.annoGiaEsistente(newSezione.annoScolastico)
              }
            })
            .then(esistente=>{
              if(!esistente){
                console.log("anno NON esistente")
                let err = new Error("L'anno " + newSezione.annoScolastico + " non esiste.")
                return Promise.reject(err);
              }
              else{
                console.log("saving")
                let newClassi = new Classi(newSezione);
                return newClassi.save()
              }
            })
            .then(()=>{
              console.log("redirecting success")
              req.session.successMsg = "Sezione creata con successo!";
              res.redirect("/admin/gestioneAnni/" + newSezione.annoScolastico +"/"+ newSezione.classe);
            })
            .catch(err=>{
              console.log("redirecting failure")
              req.session.errorMsg = "Errore nella creazione della sezione : " + err;
              res.redirect("/admin/gestioneAnni/" + newSezione.annoScolastico +"/"+ newSezione.classe);
            })

  });
  //--------------------------------- END --------------------------------------

  //Quando viene modificata una sezione bisogna controllare se le materie sono cambiate
  //In caso per ogni materia che non fa piu parte della sezione vanno eliminate le pagelle
  //---------------------------- MODIFICA SEZIONE ------------------------------
  router.post('/modificaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',async function(req,res,next){

    let oldAnno = req.params.as;
    let oldClasse = req.params.classe;
    let oldSezione = req.params.sezione;
    let newSezione = {
      annoScolastico: req.body.inizioAnnoGestioneSezione,
      classe: req.body.classeGestioneSezione,
      sezione: req.body.sezioneGestioneSezione,
      materie: req.body.materieGestioneSezione.split(","),
      maestroClasse: {
        nome: req.body.nomeMaestroGestioneSezione,
        cognome: req.body.cognomeMaestroGestioneSezione
      }
    }
    let stessaSezione = (newSezione.annoScolastico == oldAnno && newSezione.classe == oldClasse && newSezione.sezione == oldSezione)

    try{

      const sezioneEsistente = await Classi.sezioneGiaEsistente(newSezione.annoScolastico,newSezione.classe,newSezione.sezione)
      if(sezioneEsistente && !stessaSezione){
        req.session.errorMsg = "Esiste già una sezione " + newSezione.sezione + " per la classe " + newSezione.classe + " dell'anno " + newSezione.annoScolastico;
        res.redirect("/admin/gestioneAnni/" +oldAnno+"/"+oldClasse)
      }

      const annoEsistente = await AnniScolastici.annoGiaEsistente(newSezione.annoScolastico)
      if(!esistente){
        req.session.errorMsg = "Impossibile modificare la sezione, l'anno " + newSezione.annoScolastico + " non esiste"
        res.redirect("/admin/gestioneAnni/" +oldAnno+"/"+oldClasse)
      }

      const updateResults = Promise.all([ Classi.updateSezione(oldAnno,oldClasse,oldSezione,newSezione),
                                          Pagelle.updateSezione(oldAnno,oldClasse,oldSezione,newSezione) ])

      req.session.successMsg = "Sezione modificata con successo!";
      res.redirect("/admin/gestioneAnni/" +oldAnno+"/"+oldClasse)

    }
    catch(err){

      req.session.errorMsg = "Errore nella modifica della sezione : " + err;
      res.redirect("/admin/gestioneAnni/" +oldAnno+"/"+oldClasse)

    }
  })
  //--------------------------------- END --------------------------------------

  //--------------------------- ELIMINA SEZIONE --------------------------------
  router.post('/eliminaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',async function(req,res,next){
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    let sezione = req.params.sezione;
    Classi.getStudentiSezione(annoScolastico,classe,sezione)
          .then(idStudenti=>{
            let chainDeletePagelle = idStudenti.map(v=>{ return Pagelle.deletePagelleStudente(v)});
            let chainDeleteStudente = idStudenti.map(v=>{ return Studenti.deleteStudenteById(v)});
            let chainDeleteSezione = Classi.deleteSezione(annoScolastico,classe,sezione);
            return Promise.all([chainDeletePagelle,chainDeleteStudente,chainDeleteSezione])
          })
          .then(()=>{
            req.session.successMsg = "Sezione " + sezione + " eliminata con successo!";
            res.send("ok")
          })
          .catch(err=>{
            req.session.errorMsg = "Errore nell'eliminazione della sezione : " + err;
            res.send(err)
          })
  })
  //--------------------------------- END --------------------------------------


//----------------------------------- END --------------------------------------



//-------------------------- HANDLERS MODIFICHE CLASSE -------------------------


  //------------------------ CREAZIONE NUOVA CLASSE ----------------------------
  router.post('/creaNuovaClasse/:as(20[0-9][0-9]/[0-9][0-9])',async function (req,res,next){

    let newClasse = {
      annoScolastico : req.params.as,
      classe : Number(req.body.classeCreaClasse),
      sezione : req.body.sezioneCreaClasse,
      materie : req.body.materieCreaClasse.split(","),
      maestroClasse:{
        nome : req.body.nomeMaestroCreaClasse,
        cognome : req.body.cognomeMaestroCreaClasse
      },
      studenti:[]
    }

    try{
      const esistente = await Classi.classeGiaEsistente(newClasse.annoScolastico,newClasse.classe);
      if(esistente){
        req.session.errorMsg = "Errore nella creazione della classe : classe " + newClasse.classe + " già esistente";
        res.redirect("/admin/gestioneAnni/"+newClasse.annoScolastico);
      }
      else{
      const saved = await (new Classi(newClasse)).save()
      req.session.successMsg = "Classe " + newClasse.classe + " salvata con successo!";
      res.redirect("/admin/gestioneAnni/"+newClasse.annoScolastico)
      }
    }
    catch(err){
      req.session.errorMsg = "Errore nella creazione della classe : " + err;
      res.redirect("/admin/gestioneAnni/"+annoScolastico);
    }
  });
  //-------------------------------- END ---------------------------------------

  //--------------------------- MODIFICA CLASSE --------------------------------
  router.post('/modificaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',async function(req,res){
    let oldAnno = req.params.as;
    let newAnno = req.body.inizioAnnoGestioneClasse;
    let oldClasse = req.params.classe;
    let newClasse = req.body.classeGestioneClasse;

    if( (newClasse === oldClasse)&&(newAnno == oldAnno) ){
      req.session.errorMsg = "Le classe ha già il valore specificato."
      res.redirect("/admin/gestioneAnni/"+oldAnno);
    }
    try{
      const esistente = await Classi.classeGiaEsistente(newAnno,newClasse);
      if(esistente){
        req.session.errorMsg = "L'anno scolastico " + newAnno + " contiene già la classe " + newClasse
        res.redirect("/admin/gestioneAnni/"+oldAnno);
      }
      else{
        const updateClassiProm = Classi.updateClassi(oldAnno,newAnno,oldClasse,newClasse)
        const updatePagelleProm = Pagelle.updateClasse(oldAnno,newAnno,oldClasse,newClasse)
        let results = await Promise.all([updateClassiProm,updatePagelleProm]);

        req.session.successMsg = "Classe modificata con successo!"
        res.redirect("/admin/gestioneAnni/"+oldAnno);
      }
    }
    catch(err){
      req.session.errorMsg = "Errore interno.\n" + err + "\n";
      res.send("error");
    }

  })
  //---------------------------------- END -------------------------------------

  //------------------------------- ELIMINA CLASSE -----------------------------
  router.post('/eliminaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',async function(req,res){
    let classe = req.params.classe;
    let annoScolastico = req.params.as
    Classi.getStudentiClasse(annoScolastico,classe)
          .then(idStudenti=>{
            let chainDeletePagelle = idStudenti.map(v=>{ return Pagelle.deletePagelleStudente(v)});
            let chainDeleteStudente = idStudenti.map(v=>{ return Studenti.deleteStudenteById(v)});
            let chainDeleteClasse = Classi.deleteClasse(annoScolastico,classe);
            return Promise.all(chainDeletePagelle,chainDeleteStudente,chainDeleteClasse);
          })
          .then(()=>{
            req.session.successMsg = "Classe " + classe + " eliminata con successo!";
            res.send("success");
          })
          .catch(err=>{
            req.session.errorMsg = "Errore interno.\n" + err + "\n";
            res.send("error");
          })
  })
  //---------------------------------- END -------------------------------------


//----------------------------------- END --------------------------------------



//---------------------- HANDLERS MODIFICHE ANNO SCOLASTICO --------------------


  //----------------------- CREAZIONE NUOVO ANNO SCOLASTICO --------------------
  router.post('/creaNuovoAnnoScolastico',async function (req,res,next){
    try{
      let newAnno = req.body.annoScolasticoCreaAnno;

      const esistente = await AnniScolastici.annoGiaEsistente(newAnno)
      if(esistente){
        req.session.errorMsg = "L'anno scolastico " + newAnno + " esiste già!"
        res.redirect("/admin/gestioneAnni");
      }

      let anno = new AnniScolastici({nome:newAnno});
      const saved = await anno.save()

      req.session.successMsg = "Anno " + newAnno + " creato con successo!"
      res.redirect("/admin/gestioneAnni")
    }
    catch(err){
      req.session.errorMsg = "Errore interno : " + err;
      res.redirect("/admin/gestioneAnni")
    }
  })
  //------------------------------------ END -----------------------------------


  //----------------------- MODIFICA ANNO SCOLASTICO ---------------------------
  router.post('/modificaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',async function(req,res,next){
    let oldAnno = req.params.as
    let newAnno = req.body.annoScolasticoGestioneAnno

    try{
      const esistente = await AnniScolastici.annoGiaEsistente(newAnno)
      if(esiste){
        req.session.errorMsg = "L'anno scolastico " + newAnno + " esiste già!"
        res.redirect("/admin/gestioneAnni");
      }
      const updateAnniProm = AnniScolastici.updateAnnoScolastico(oldAnno,newAnno);
      const updateClassiProm = Classi.updateAnnoScolastico(oldAnno,newAnno);
      const updatePagelleProm = Pagelle.updateAnnoScolastico(oldAnno,newAnno);

      const results = await Promise.all(updateAnniProm,updateClassiProm,updatePagelleProm);
      req.session.successMsg = "Anno modificato con successo!"
      res.redirect("/admin/gestioneAnni")
    }
    catch(err){
        req.session.errorMsg = "Errore interno.\n" + err + "\n";
        res.redirect("/admin/gestioneAnni");
      }
  });
  //------------------------------------ END -----------------------------------


  //----------------------- ELIMINA ANNO SCOLASTICO ----------------------------
  router.post('/eliminaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',async (req,res,next)=>{
    try{
      let annoScolastico = req.params.as;
      const studenti = await Classi.getStudentiFromAnnoScolastico(annoScolastico)
      console.log(require('util').inspect(studenti, { depth: null }));
      const deletePagelleProm = Promise.all( studenti.map(s=>{ return Pagelle.deletePagelleStudente(s) }) )
      const deleteStudentiProm = Promise.all( studenti.map(s=>{ return Studenti.deleteStudenteById(s)  }) )
      const deleteClassiProm = Classi.deleteAnno(annoScolastico)
      const deletePermessiProm = PermessiUtente.deleteAnno(annoScolastico)
      const deleteAnniProm = Anni.deleteAnno(annoScolastico)
      let results = await Promise.all([deletePagelleProm,deleteStudentiProm,deleteClassiProm,deletePermessiProm,deleteAnniProm])

      req.session.successMsg = "Anno " + annoScolastico + " eliminato con successo!";
      res.send("success");
    }
    catch(err){
      req.session.errorMsg = "Errore interno.\n" + err + "\n";
      res.send("error");
    }
  });
  //------------------------------------ END -----------------------------------


//----------------------------------- END --------------------------------------





//------------------------- PAGINE AREA AMMINISTRATORE -------------------------

  //ok
  //---------------------------- GESTIONE STUDENTI -----------------------------
  router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',function(req,res,next){
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    let sezione = req.params.sezione;
    Classi.getStudentiFromAnnoScolasticoAndClasseAndSezione(annoScolastico,classe,sezione)
      .then(idStudenti=>{
        return Studenti.getInfoStudentiById(idStudenti)
      })
      .then(infoStudenti=>{
        res.render('./areaAmministratore/gestioneDB/gestioneStudenti',{layout:'authLayout',success_msg:res.locals.successMsg,error_msg:res.locals.errorMsg,title:'Gestione Studenti',subTitle:'Gestione Studenti Classe ' + classe + ' Sezione ' +sezione ,annoScolastico:annoScolastico,classe:classe,sezione:sezione,studenti:infoStudenti})
      })
      .catch(err=>{
        next(err);
      })
  });
  //----------------------------------- END ------------------------------------

  //ok
  //----------------------------- GESTIONE SEZIONI -----------------------------
  router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function(req,res,next){
    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    Classi.getSezioniFromAnnoScolasticoAndClasse(annoScolastico,classe)
          .then(sezioni=>{
            res.render('./areaAmministratore/gestioneDB/gestioneSezioni',{layout:'authLayout',success_msg:res.locals.successMsg,error_msg:res.locals.errorMsg,title:'Gestione Sezioni',subTitle:'Gestione Sezioni Classe ' + classe ,annoScolastico:annoScolastico,classe:classe,sezioni:sezioni})
          })
          .catch(err=>{
            next(err);
          })
  });
  //----------------------------------- END ------------------------------------

  //ok
  //------------------------------ GESTIONE CLASSI -----------------------------
  router.get('/:as(20[0-9][0-9]/[0-9][0-9]$)',function(req,res,next){
      let annoScolastico = req.params.as;
      Classi.getClassiFromAnnoScolastico(annoScolastico)
        .then(classi=>{
          res.render('./areaAmministratore/gestioneDB/gestioneClassi',{layout:'authLayout',success_msg:res.locals.successMsg,error_msg:res.locals.errorMsg,title:'Gestione Classi',subTitle:'Gestione Classi '+ annoScolastico,annoScolastico:annoScolastico,classi:classi})
        })
        .catch(err=>{
          next(err)
        })
  });
  //----------------------------------- END ------------------------------------

  //ok
  //------------------------- GESTIONE ANNI SCOLASTICI -------------------------
  router.get('/',function(req,res,next){
      AnniScolastici.getAnniScolastici()
        .then(anniScolastici=>{
          console.log(require('util').inspect(anniScolastici, { depth: null }));
          res.render('./areaAmministratore/gestioneDB/gestioneAnni',{layout:'authLayout',success_msg:res.locals.successMsg,error_msg:res.locals.errorMsg,title:'Gestione Anni Scolastici',subtitle:'Gestione Anni Scolastici',anniScolastici:anniScolastici})
        })
        .catch(err=>{
          next(err)
        })
  });
  //----------------------------------- END ------------------------------------


//----------------------------------- END --------------------------------------





//---------------------------- EXPORT DEL MODULO -------------------------------
module.exports = router;
//----------------------------------- END --------------------------------------
