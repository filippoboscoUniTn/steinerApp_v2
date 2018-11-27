"use strict";
//----------------------------- NODE MODULES -----------------------------------
const express = require('express');
const util = require('util');
//--------------------------------- END ----------------------------------------


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
      try{
        let id = req.params.id;
        const infoUtente = await Utenti.getUserById(id);
        console.log(infoUtente)
        res.render("./areaAmministratore/gestioneDB/infoUtente",{  layout:"authLayout",
                                                                  title:"Informazioni Utente",
                                                                  subtitle:"<a href='\\admin/gestioneUtenti'>Gestione Utenti</a> &gt <a href='\\admin/gestioneUtenti/utente/"+ infoUtente.id +"'>Info e Permessi</a> &gt Informazioni",
                                                                  utente:infoUtente
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
        const permessiUtente = await PermessiUtente.getPermessiUtenteByAnno(infoUtente,annoScolastico);
        res.render("./areaAmministratore/gestioneDB/gestionePermessiUtente",{ layout:"authLayout",
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
        res.render("./areaAmministratore/gestioneDB/gestioneUtente",{ layout:"authLayout",
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
        res.render("./areaAmministratore/gestioneDB/infoPermessiUtente",{ layout:"authLayout",
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
        res.render("./areaAmministratore/gestioneDB/gestioneUtenti",{ layout:"authLayout",
                                                                      title:"Gestione Utenti",
                                                                      subtitle:"Gestione Utenti",
                                                                      utenti:utenti,
                                                                      admins:admins})
      }
      catch(err){
        next(err)
      }
    })
  //--------------------------------- END --------------------------------------


  //------------------------------- POST HANDLERS ------------------------------
    router.post("/deletePermesso/:id/:annoScolastico(20[0-9][0-9]/[0-9][0-9])/:materia",async(req,res,next)=>{

    })
    router.post("/updatePermesso/:id/:annoScolastico(20[0-9][0-9]/[0-9][0-9])/:materia",async(req,res,next)=>{

    })
  //------------------------------------ END -----------------------------------

//--------------------------------- END ----------------------------------------


//--------------------------------- EXPORTS ------------------------------------
module.exports = router;
//--------------------------------- END ----------------------------------------


//---------------------------------- RITAGLIA ----------------------------------
// for(let i=0;i<utenti.length;i++){
//   utenti[i].permessi = [];
//   for(let j=0;j<anniScolastici.length;j++){
//     let permessiAnnoProm = {
//       annoScolastico:anniScolastici[j],
//       permessiProm: PermessiUtente.getPermessiUtenteByAnno(utenti[i],anniScolastici[j].nome)
//     }
//     utenti[i].permessi.push(permessiAnnoProm);
//   }
// }
// for(let i=0;i<utenti.length;i++){
//   for(let k=0;k<utenti[i].permessi.length;k++){
//       utenti[i].permessi[k].permessiAnno = await utenti[i].permessi[k].permessiProm;
//   }
// }
//------------------------------------ END -------------------------------------
