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



//----------------------- MIDDLEWARE PER MESSAGGI FLASH ------------------------
router.use(function(req,res,next){
  if(req.session.successMsg != null){
    res.locals.successMsg = req.session.successMsg;
    delete req.session.successMsg;
  }
  if(req.session.errorMsg != null){
    res.locals.errorMsg = req.session.errorMsg;
    delete req.session.errorMsg;
  }
  next();
});
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

  let annoScolastico = req.params.as;
  let classe = req.params.classe;
  let sezione = req.params.sezione;
  console.log(annoScolastico + "\n" + classe + "\n" + sezione)
  Studenti.getStudentiFromAnnoScolasticoAndClasseAndSezione(annoScolastico,classe,sezione,function(err,studenti){
    if(err){
      res.send(err);
    }
    else{
        let cleanUpPromiseChain = [];
        for(let k=0;k<studenti.length;k++){
          let cleanPagelleStudente = new Pormise(function (resolve,reject){
            Pagelle.deleteMany({idStudente:studenti[k]},function(err){
              if(err){
                reject(err)
              }
              else{
                resolve()
              }
            })
          })
          let cleanStudente = new Pomise(function(resolve,reject){
            Studenti.deleteMany({id:studenti[k]},function(err){
              if(err){
                reject(err);
              }
              else{
                resolve()
              }
            })
          })
          cleanUpPromiseChain.push(cleanPagelleStudente);
          cleanUpPromiseChain.push(cleanStudente);
        }


    }
  })

})
//----------------------------------- END --------------------------------------



//-------------------------- HANDLERS MODIFICHE CLASSE -------------------------


  //------------------------ CREAZIONE NUOVA CLASSE ----------------------------
  router.post('/creaNuovaClasse/:as(20[0-9][0-9]/[0-9][0-9])',function (req,res,next){
      let annoScolastico = req.params.as;
      let classe = req.params.classe;

      Classi.classeGiaEsistente(annoScolastico,classe,function (err,esistente){
        if(err){
          throw err
          req.session.errorMsg = "Errore nella creazione della classe : " + err;
          res.redirect("/admin/gestioneAnni/"+annoScolastico);
        }
        else if(esistente){
          console.log("esistente")
          //req.session.errorMsg = "Errore nella creazione della classe : classe " + classe + " già esistente";
          //res.redirect("/admin/gestioneAnni/"+annoScolastico);
          res.send("esistente")
        }
        else{
          console.log("else")

          let newClasse = new Classi({
            annoScolastico: annoScolastico,
            classe: classe
          });
          console.log("newClasse.classe = " + newClasse.classe)
          newClasse.save( (err,classeCreata,numAffected) => {
            if(err){
              req.session.errorMsg = "Errore nel salvataggio della classe nel database : " + err;
              res.redirect("/admin/gestioneAnni/"+annoScolastico);
            }
            else{
              req.session.successMsg = "Classe " + classe + " salvata con successo!";
              res.redirect("/admin/gestioneAnni/"+annoScolastico);
            }
          });
        }
      });
  });
  //-------------------------------- END ---------------------------------------


  //--------------------------- MODIFICA CLASSE --------------------------------
  router.post('/modificaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function(req,res){
    let annoScolastico = req.params.as;
    let oldClasse = req.params.classe;
    let newClasse = req.body.nuovaClasse;
    //------------------ CLASSI UGUALI, NESSUNA MODIFICA -----------------------
    if(newClasse === oldClasse){
      console.log("classi uguali, nessuna modifica");
      res.send("Nessuna modifica, le due classi coincidono!");
    }
    //-------------------------------- END -------------------------------------
    else{
      console.log("classi diverse, controllo unicità nuova classe");
      Classi.classeGiaEsistente(annoScolastico,newClasse,function (err,esistente){
        //----------------------------- ERRORE ---------------------------------
        if(err){
          res.send("Impossibile modificare la classe: " + err);
        }
        //--------------------------------- END --------------------------------
                                            //
        //----------------------- CLASSE GIÀ ESISTENTE -------------------------
        else if(esistente){
          res.send("Impossibile modificare la classe: classe già esistente!");
        }
        //--------------------------------- END --------------------------------
        else{
          let cleanUpPromiseChain = [];

          let updateClassiPromise = Classi.updateClassi(annoScolastico,oldClasse,newClasse);
          let updatePagellePromise = Pagelle.updateClasse(annoScolastico,oldClasse,newClasse);

          cleanUpPromiseChain.push(updateClassiPromise);
          cleanUpPromiseChain.push(updatePagellePromise);

          Promise.all(cleanUpPromiseChain).then(()=>{
            res.send("Classe modificata con successo!");
          },err=>{
            res.send("Errore : " + err);
          })

        }
      })
    }
  })
  //---------------------------------- END -------------------------------------


  //------------------------------- ELIMINA CLASSE -----------------------------
  router.post('/eliminaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function(req,res){

    let annoScolastico = req.params.as;
    let classe = req.params.classe;
    console.log("annoScolastico = " + annoScolastico + "\nclasse = " + classe);
    Classi.getStudentiFromAnnoScolasticoAndClasse(annoScolastico,classe,function (err,studenti){
      console.log("studenti = " + studenti);
      let cleanUpPromiseChain = [];
      //--------------------- PROMESSA RIMOZIONE STUDENTI E PAGELLE ------------
      for(let i=0;i<studenti.length;i++){
        console.log("idStudente = " + studenti[i]);
        let deletePagellePromise = new Promise(function(resolve, reject) {
          Pagelle.deleteMany({idStudente:studenti[i]},function (err){
            if(err){
              reject(err);
            }
            else{
              resolve();
            }
          })
        });
        let deleteStudentePromise = new Promise(function(resolve, reject) {
          Studenti.deleteOne({id:studenti[i]},function (err){
            if(err){
              reject(err);
            }
            else{
              resolve();
            }
          })
        });
        cleanUpPromiseChain.push(deletePagellePromise);
        cleanUpPromiseChain.push(deleteStudentePromise);
      }
      //---------------------------------- END ---------------------------------

      //----------------------- PROMESSA RIMOZIONE PERMESSI --------------------
      //---------------------------------- END ---------------------------------

      //------------------------- PROMESSA RIMOZIONE CLASSE --------------------
      let removeClassePromise = new Promise(function (resolve,reject) {
        Classi.deleteMany({annoScolastico:annoScolastico,classe:classe},function (err){
          if(err){
            reject(err);
          }
          else{
            resolve();
          }
        })
      });
      cleanUpPromiseChain.push(removeClassePromise);
      //---------------------------------- END ---------------------------------

      //------------------- SUCCESSFULL CHAIN RESOLUTION -----------------------
      Promise.all(cleanUpPromiseChain).then(()=>{
        res.send("Classe Eliminata con successo!");
      //-------------------------------- END -----------------------------------

      //--------------------- ERROR IN CHAIN RESOLUTION ------------------------
      },err=>{
        let errore = "Impossibile Rimuovere la Classe\nErrore : " + err;
        res.send(errore);
      })
      //-------------------------------- END -----------------------------------

    });

  });
  //---------------------------------- END -------------------------------------


//----------------------------------- END --------------------------------------



//---------------------- HANDLERS MODIFICHE ANNO SCOLASTICO --------------------


  //----------------------- CREAZIONE NUOVO ANNO SCOLASTICO --------------------
  router.post('/creaNuovoAnnoScolastico',function (req,res,next){

    let inizioAnno = req.body.inizioNuovoAnno;
    let fineAnno = req.body.fineNuovoAnno;
    let anno = String.prototype.concat(inizioAnno,"/",fineAnno.split("")[2],fineAnno.split("")[3])

    AnniScolastici.annoGiaEsistente(anno,function (err,esistente){
      if(err){
        req.session.errorMsg = "Errore nella creazione dell'anno : " + err;
        res.redirect('/admin/gestioneAnni');
      }
      else if(esistente){
        req.session.errorMsg = "Impossibile creare il nuovo anno : anno già esistente!"
        res.redirect('/admin/gestioneAnni');
      }
      else{
        let newAnno = new AnniScolastici({
          nome:anno
        })
        newAnno.save( (err,annoCreato,numAffected) =>{
          if(err){
            req.session.errorMsg = "Errore nella creazione dell'anno : " + err;
            res.redirect('/admin/gestioneAnni');
          }
          else{
            req.session.successMsg = "Anno " + annoCreato.nome + " creato con successo!";
            res.redirect('/admin/gestioneAnni');
          }
        });
      }
    })
  })
  //------------------------------------ END -----------------------------------


  //----------------------- MODIFICA ANNO SCOLASTICO ---------------------------
  router.post('/modificaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function(req,res,next){

    let nuovoInizioAnnoScolastico = req.body.inizioAnno;
    let nuovaFineAnnoScolastico = req.body.fineAnno;

    let oldAnnoScolastico = req.params.as;
    let nuovoAnnoScolastico = String.prototype.concat(nuovoInizioAnnoScolastico,"/",nuovaFineAnnoScolastico.split("")[2],nuovaFineAnnoScolastico.split("")[3]);

    let updatePromiseChain = [];

    //-------------------------- UPDATE DELLE CLASSI ---------------------------
    let updateClassi = new Promise(function(resolve, reject) {
      Classi.update({annoScolastico:oldAnnoScolastico},{$set:{annoScolastico:nuovoAnnoScolastico}},function (err,numAffected){
        if(err){
          reject(err);
        }
        else{
          resolve();
        }
      })
    });
    updatePromiseChain.push(updateClassi)
    //---------------------------------- END -----------------------------------

    //------------------------ UPDATE PERMESSI UTENTE --------------------------
    let updatePermessi = new Promise(function(resolve, reject){
      PermessiUtente.update({annoScolastico:oldAnnoScolastico},{$set:{annoScolastico:nuovoAnnoScolastico}},function (err,numAffected){
        if(err){
          reject(err);
        }
        else{
          resolve();
        }
      })
    });
    updatePromiseChain.push(updatePermessi)
    //---------------------------------- END -----------------------------------

    //-------------------------- UPDATE DELLE PAGELLE --------------------------
    let updatePagelle = new Promise(function(resolve, reject) {
      Pagelle.update({annoScolastico:oldAnnoScolastico},{$set:{annoScolastico:nuovoAnnoScolastico}},function (err,numAffected){
        if(err){
          reject(err);
        }
        else{
          resolve();
        }
      })
    });
    updatePromiseChain.push(updatePagelle)
    //---------------------------------- END -----------------------------------

    //---------------------- UPDATE DELL'ANNO SCOLASTICO -----------------------
    let updateAnnoScolastico = new Promise(function(resolve, reject) {
      AnniScolastici.update({nome:oldAnnoScolastico},{$set:{nome:nuovoAnnoScolastico}},function (err,numAffected){
        if(err){
          reject(err);
        }
        else{
          resolve();
        }
      })
    });
    updatePromiseChain.push(updateAnnoScolastico)
    //---------------------------------- END -----------------------------------

    //------------------------ UPDATE SUCCESSFULL ------------------------------
    Promise.all(updatePromiseChain).then( () => {
      req.session.successMsg = "Anno Scolastico Modificato con successo!";
      res.redirect("/admin/gestioneAnni");
    //---------------------------------- END -----------------------------------

    //------------------------ ERROR DURING UPDATE -----------------------------
    }, err => {
      req.session.errorMsg = "Impossibile modificare l'anno. Errore : " + err;
      res.redirect("/admin/gestioneAnni");
    });
    //---------------------------------- END -----------------------------------

  });
  //------------------------------------ END -----------------------------------


  //----------------------- ELIMINA ANNO SCOLASTICO ----------------------------
  router.post('/eliminaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function (req,res,next){
      let annoScolastico = req.params.as;
      Classi.getStudentiFromAnnoScolastico(annoScolastico,function (err,studenti){

        let cleanUpPromiseChain = [];

        //------------- PROMESSA RIMOZIONE STUDENTI E PAGELLE ------------------
        for(let i=0;i<studenti.length;i++){
          let deletePagellePromise = new Promise(function(resolve, reject) {
            Pagelle.deleteMany({idStudente:studenti[i]},function (err){
              if(err){
                reject(err);
              }
              else{
                resolve();
              }
            })
          });
          let deleteStudentePromise = new Promise(function(resolve, reject) {
            Studenti.deleteOne({id:studenti[i]},function (err){
              if(err){
                reject(err);
              }
              else{
                resolve();
              }
            })
          });
          cleanUpPromiseChain.push(deletePagellePromise);
          cleanUpPromiseChain.push(deleteStudentePromise);
        }
        //-------------------------------- END ---------------------------------


        //--------------------- PROMESSA RIMOZIONE CLASSI ----------------------
        let removeClassiPromise = new Promise(function(resolve, reject) {
          Classi.deleteMany({annoScolastico:annoScolastico},function (err){
            if(err){
              reject(err);
            }
            else{
              resolve();
            }
          })
        });
        cleanUpPromiseChain.push(removeClassiPromise);
        //-------------------------------- END ---------------------------------


        //------------------- PROMESSA RIMOZIONE PERMESSI ----------------------
        let removePermessiPromise = new Promise(function(resolve, reject) {
          PermessiUtente.deleteMany({annoScolastico:annoScolastico},function (err){
            if(err){
              reject(err);
            }
            else{
              resolve();
            }
          })
        });
        cleanUpPromiseChain.push(removePermessiPromise);
        //-------------------------------- END ---------------------------------


        //---------------- PROMESSA RIMOZIONE ANNO SCOLASTICO ------------------
        let removeAnnoScolasticoPromise = new Promise(function(resolve, reject) {
          AnniScolastici.deleteOne({nome:annoScolastico},function (err){
            if(err){
              reject(err);
            }
            else{
              resolve();
            }
          })
        });
        cleanUpPromiseChain.push(removeAnnoScolasticoPromise);
        //-------------------------------- END ---------------------------------


        //------------------- SUCCESSFULL CHAIN RESOLUTION ---------------------
        Promise.all(cleanUpPromiseChain).then(()=>{
          res.send("Anno Scolastico Eliminato con successo!");
        //-------------------------------- END ---------------------------------


        //--------------------- ERROR IN CHAIN RESOLUTION ----------------------
        },err=>{
          let errore = "Impossibile Rimuovere l'Anno Scolastico\nErrore : " + err;
          res.send(errore);
        })
        //-------------------------------- END ---------------------------------
      })
  });
  //------------------------------------ END -----------------------------------


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
              res.render('./areaAmministratore/gestioneDB/gestioneClassi',{layout:'authLayout',success_msg:res.locals.successMsg,error_msg:res.locals.errorMsg,title:'Gestione Classi',subTitle:'Gestione Classi '+ annoScolastico,annoScolastico:annoScolastico,classi:classi})
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
              res.render('./areaAmministratore/gestioneDB/gestioneAnni',{layout:'authLayout',success_msg:res.locals.successMsg,error_msg:res.locals.errorMsg,title:'Gestione Anni Scolastici',subTitle:'Gestione Anni Scolastici',anniScolastici:anniScolastici})
          }
      })
  });
  //----------------------------------- END ------------------------------------


//----------------------------------- END --------------------------------------





//---------------------------- EXPORT DEL MODULO -------------------------------
module.exports = router;
//----------------------------------- END --------------------------------------
