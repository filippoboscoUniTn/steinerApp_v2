"use strict";
//----------------------------- NODE MODULES -----------------------------------
const express = require('express');
const validator = require("express-validator");
//--------------------------------- END ----------------------------------------

//-------------------------------- MODULES -------------------------------------
const Validators = require('../../modules/validators');
//------------------------------------ END -------------------------------------

//-------------------------------- MODELS --------------------------------------
const Utenti = require('../../models/utenti');
const AnniScolastici = require('../../models/anniScolastici');
const Classi = require('../../models/classi')
const PermessiUtente = require('../../models/permessiUtente')
//--------------------------------- END ----------------------------------------



//--------------------------------- ROUTER -------------------------------------
let router = express.Router();

  //------------------------------ GET HANDLERS --------------------------------
    router.get("/utente/:id/infoUtente",async(req,res,next)=>{
      console.log("req.session.success_msg  == " + req.session.successMsg)
      try{
        let id = req.params.id;
        const infoUtente = await Utenti.getUserById(id);
        console.log(infoUtente)
        res.render("./areaAmministratore/gestioneDB/gestioneUtenti/infoUtente",{  layout:"authLayout",
                                                                  title:"Informazioni Utente",
                                                                  subtitle:"<a href='\\admin/gestioneUtenti'>Gestione Utenti</a> &gt <a href='\\admin/gestioneUtenti/utente/"+ infoUtente.id +"'>Info e Permessi</a> &gt Informazioni",
                                                                  utente:infoUtente,
                                                                  success_msg:res.locals.successMsg
                                                              })
      }
      catch(err){
        next(err)
      }

    })

    router.get("/utente/:id/permessi/:annoScolastico(20[0-9][0-9]/[0-9][0-9]$)",async(req,res,next)=>{
      let id = req.params.id;
      let annoScolastico = req.params.annoScolastico
      try{
        const infoUtente = await Utenti.getUserById(id)
        const permessiUtente = await PermessiUtente.getPermessiUtenteByAnno(id,annoScolastico);
        res.render("./areaAmministratore/gestioneDB/gestioneUtenti/gestionePermessiUtente",{ layout:"authLayout",
                                                                              title:"Gestione Permessi",
                                                                              subtitle:"<a href='\\admin/gestioneUtenti'>Gestione Utenti</a> &gt <a href='\\admin/gestioneUtenti/utente/"+infoUtente.id+"'>Info e Permessi</a> &gt <a href='\\admin/gestioneUtenti/utente/"+infoUtente.id+"/permessi'>" + annoScolastico +"</a>",
                                                                              utente:infoUtente,
                                                                              permessi:permessiUtente})
      }
      catch(err){
        next(err)
      }
    })

    router.get("/utente/:id/permessi",async(req,res,next)=>{
      let id = req.params.id;
      try{
        const infoUtente = await Utenti.getUserById(id);
        const anniPermessi = await PermessiUtente.getAnniScolasticiUtente(infoUtente.nome,infoUtente.cognome);
        res.render("./areaAmministratore/gestioneDB/gestioneUtenti/gestioneUtente",{ layout:"authLayout",
                                                                      title:"Gestione Utente",
                                                                      subtitle:"<a href='\\admin/gestioneUtenti'>Gestione Utenti</a> &gt <a href='\\admin/gestioneUtenti/utente/"+infoUtente.id+"'>Info e Permessi</a> &gt Permessi Utente",
                                                                      utente:infoUtente,
                                                                      permessi:anniPermessi})

      }
      catch(err){
        next(err)
      }
    })

    router.get("/utente/:id",async(req,res,next)=>{
      try{
        let id = req.params.id
        const infoUtente = await Utenti.getUserById(id);
        res.render("./areaAmministratore/gestioneDB/gestioneUtenti/infoPermessiUtente",{ layout:"authLayout",
                                                                          title:"Info e Permessi Utente",
                                                                          subtitle:"<a href='\\admin/gestioneUtenti'>Gestione Utenti</a> &gt Info e Permessi" ,
                                                                          id:id })
      }
      catch(err){
          next(err)
      }
    })

    router.get("/",async(req,res,next)=>{
      try{
        const utenti = await Utenti.getTeachers();
        const admins = await Utenti.getAdmins();
        res.render("./areaAmministratore/gestioneDB/gestioneUtenti/gestioneUtenti",{ layout:"authLayout",
                                                                      title:"Gestione Utenti",
                                                                      subtitle:"Gestione Utenti",
                                                                      utenti:utenti,
                                                                      admins:admins,
                                                                      success_msg:res.locals.successMsg,
                                                                      error_msg:res.locals.errorMsg
                                                                      })
      }
      catch(err){
        next(err)
      }
    })
  //--------------------------------- END --------------------------------------


  //------------------------------- POST HANDLERS ------------------------------

    //------------------------- MODIFICA INFORMAZIONI UTENTE -------------------
    router.post("/utente/:id/infoUtente",async(req,res,next)=>{
      let id = req.params.id;
      try{
        const validationErrors = await Validators.infoUtenteValidator(req,id);
        const usernameAvalibility = await Utenti.usernameAvalibility(req.body.username,id);
        const infoUtente = await Utenti.getUserById(id);

        if(validationErrors.isEmpty() && usernameAvalibility){
          let updatedUser = {
            nome: req.body.nome,
            cognome: req.body.cognome,
            email : req.body.email,
            username : req.body.username,
            authorization: req.body.authorization,
            status: req.body.status
          }
          const updateRes = await Utenti.updateUser(id,updatedUser);
          req.session.successMsg = "Utente modificato con successo!";
          res.redirect("/admin/gestioneUtenti/utente/"+id+"/infoUtente")
        }
        else{
          let errors = validationErrors.array().map(error=>{return error.msg});
          if(!usernameAvalibility){
            errors.push("Username già in uso");
          }
          res.render("./areaAmministratore/gestioneDB/gestioneUtenti/infoUtente",{ layout:"authLayout",
                                                                    title:"Informazioni Utente",
                                                                    subtitle:"<a href='\\admin/gestioneUtenti'>Gestione Utenti</a> &gt <a href='\\admin/gestioneUtenti/utente/"+ infoUtente.id +"'>Info e Permessi</a> &gt Informazioni",
                                                                    utente:infoUtente,
                                                                    errors:errors })
        }
       }
      catch(err){
       next(err);
      }
    })
    //------------------------------------ END ---------------------------------

    //------------------------------ ELIMINA UTENTE ----------------------------
    router.post("/utente/:id/deleteUtente",async (req,res,next)=>{
      try{
        let id = req.params.id;
        const deleteUtente = await Utenti.deleteUtente(id);
        req.session.successMsg = "Utente Eliminato con successo!";
        res.send("ok")
      }
      catch(err){
        req.session.errorMsg = "Errore durante l'eliminazione dell'utente!"
        res.send(err)
      }
    })
    //------------------------------------ END ---------------------------------

    //--------------------------- ELIMINA PERMESSO UTENTE ---------------------
    router.post("/deletePermesso/:id/:annoScolastico(20[0-9][0-9]/[0-9][0-9])/:materia",async(req,res,next)=>{

    })
    //------------------------------------ END ---------------------------------

    //-------------------------- MODIFICA PERMESSO UTENTE ----------------------
    router.post("/creaPermesso/:id/:annoScolastico(20[0-9][0-9]/[0-9][0-9]$)",async(req,res,next)=>{
      console.log("hello from modifica permesso")
      let annoScolastico = req.params.annoScolastico;
      let id = req.params.id;
      let materia = req.body.materia;
      let classi = req.body.classi;
      console.log(annoScolastico,id,materia,classi);
      try{

      }
      catch(err){

      }
    })
    //----------------------------------- END ----------------------------------

    //-------------------------- CREA NUOVO PERMESSO ---------------------------
    router.post("",async(req,res,next)=>{

    })
    //----------------------------------- END ----------------------------------

  //------------------------------------ END -----------------------------------

//--------------------------------- END ----------------------------------------


//--------------------------------- EXPORTS ------------------------------------
module.exports = router;
//--------------------------------- END ----------------------------------------
