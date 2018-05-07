"use strict";
const express = require('express');

//Models
const Classi = require('../models/classi');
const PermessiUtente = require('../models/permessiUtente');

//Modules
const utilityFunctions = require('../modules/utilityFunctions');

let router = express.Router();

router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia/:classe([1-8])/:sezione',function (req,res,next){
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let classe = Number(req.params.classe);
    let sezione = req.params.sezione;
    Classi.getStudentiFromAnnoScolasticoClasseSezione(annoScolastico,classe,sezione,function(err,studenti){
        if(err){
            next(err)
        }
        res.render('./areaUtente/studenti',{layout:'authLayout',title:'Studenti',subTitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"'>"+'Classi'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"/"+classe+"'>"+'Sezioni'+"</a>",h4_1:'Studenti :',annoScolastico:annoScolastico,materia:materia,classe:classe,sezione:sezione,studenti:studenti})
    })
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia/:classe([1-8]$)',function (req,res,next){
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let classe = Number(req.params.classe);

    Classi.getSezioniFromAnnoScolasticoMateriaClasse(annoScolastico,materia,classe,function(err,sezioni){
        if(err){
            next(err)
        }
        else if(sezioni.length <= 1){ //Per la classe esiste una sola sezione, redirect alla pagina degli studenti
            console.log("redirecting");
            res.send("shi")
            //res.redirect('/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezioni[0]) //TBI
        }
        else{
            res.render('./areaUtente/sezioni',{layout:'authLayout',title:'Sezioni',subTitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"/"+materia+"'>"+'Classi'+"</a>",h4_1:'Sezioni :',as:annoScolastico,materia:materia,classe:classe,sezioni:sezioni})
        }
    })
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9])/:materia',function (req,res,next){
    let annoScolastico = req.params.as;
    let materia = req.params.materia;
    let isAdmin = false;
    if(req.user.authorization === 'ADMIN'){ //Controlla se l'utente è ADMIN
        isAdmin = true;
    }
    Classi.getClassiFromAnnoScolasticoMateria(annoScolastico,materia,function (err,classi){
        if(err){
            next(err)
        }
        if(isAdmin) {//L'utente è ADMIN, mostra tutte le Classi che hanno la materia specificata nello URL
            console.log("classi = " + classi)
            res.render('./areaUtente/classi',{layout:'authLayout',title:'Classi',subTitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+'Materie'+"</a>",titoloSezione:'Classi',annoScolastico:annoScolastico,materia:materia,classi:classi})
        }
        else {//L'utente NON è ADMIN, mostra solo le classi per cui l'utente ha i permessi e che hanno la materia specificata nello URL
            let nome = req.user.nome;
            let cognome = req.user.cognome;
            PermessiUtente.getClassiFromAnnoScolasticoMateria(nome,cognome,annoScolastico,materia,function (err,classiPermesso){
                if(err){
                    next(err)
                }
                let classiMaestro = utilityFunctions.intersect(classiPermesso,classi);
                res.render('./areaUtente/classi',{layout:'authLayout',title:'Classi',subTitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>"+" &gt "+"<a href='/pagelle/annoScolastico/"+annoScolastico+"'>"+materia+"</a>",titoloSezione:'Classi',annoScolastico:annoScolastico,materia:materia,classi:classi})
            })
        }
    });
});


router.get('/annoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function (req,res,next){
    let annoScolastico = req.params.as;
    let isAdmin = false;
    if(req.user.authorization === 'ADMIN'){
        isAdmin = true;
    }
    if(isAdmin){ //Utente è amministratore, mostra tutte le materie
        Classi.getMaterieFromAnnoScolastico(annoScolastico,function (err,materie){
            if(err){
                next(err);
            }
            res.render('./areaUtente/materie',{layout:'authLayout',title:'Materie',subTitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>",titoloSezione:'Materie',materie:materie,annoScolastico:annoScolastico});
        })
    }
    else{//Utente NON è amministratore, mostra le materie relative ai permessi dell'utente
        PermessiUtente.getMaterieFromAnnoScolastico(req.user.nome,req.user.cognome,annoScolastico,function (err,materie){
            if(err){
                next(err);
            }
            res.render('./areaUtente/materie',{layout:'authLayout',title:'Materie',subTitle:"<a href='\\index '>"+'Anni Scolastici'+"</a>",titoloSezione:'Materie',materie:materie,annoScolastico:annoScolastico});
        })
    }
});

module.exports = router;