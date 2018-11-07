"use strict";

//-------------------------------- PACKAGES ------------------------------------
const path = require('path');
const util = require('util');
//----------------------------------- END --------------------------------------


//--------------------------------- MODULI -------------------------------------
const compareModule = require('./comparisonFunctions');
//----------------------------------- END --------------------------------------


//--------------------- HANDLEBARS HELPER FUNCTIONS ----------------------------
let handlebarsHelpers = {

    //------------------------- HELPERS AREA UTENTE ----------------------------
    printAnniScolastici:function (anniScolastici){
        let ret='';
        if(anniScolastici != null){
            for(let i=0;i<anniScolastici.length;i++){
                if( (i+2)%2===0){
                    ret+='<div class="col-sm-5 gray">';
                }
                else{
                    ret+='<div class="col-sm-5 col-sm-offset-1 gray">'
                }
                ret+='<a class="centered" href="/pagelle/annoScolastico/'+anniScolastici[i].nome + '"><h3>'+anniScolastici[i].nome+'</h3></a></div>';
            }
            return ret;
        }
        else{
            return ret;
        }
    },
    printMaterie:function (materie,annoScolastico){
        let ret = "";
        if(materie !== null){
            for(let i=0;i<materie.length;i++){
                if( (i+2)%2==0){
                    ret+='<div class="col-sm-5 gray">';
                }
                else{
                    ret+='<div class="col-sm-5 col-sm-offset-1 gray">';
                }
                ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+ materie[i] +'"><h3 class="centered">'+ materie[i] +'</h3></a></div>';
            }
        }
        return ret;
    },
    printClassi:function (annoScolastico,materia,classi){
        let ret = "";
        for(let i = 0; i<classi.length; i++){
            if( (i+4)%4 === 0 ){
                ret+='<div class="col-sm-2 gray">'
            }
            else{
                ret+='<div class="col-sm-2 col-sm-offset-1 gray">'
            }
            ret+='<a class="centered" href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classi[i]+'"><h3>'+classi[i]+'</h3></a></div>'
        }
        return ret;
    },
    printSezioni:function (annoScolastico,materia,classe,sezioni){
        let ret = "";
        for(let i=0;i<sezioni.length;i++){
            if((i+4)%4 === 0){
                ret+='<div class="col-sm-2 gray">'
            }
            else{
                ret+='<div class="col-sm-2 col-sm-offset-1 gray">'
            }
            ret+='<a class="centered" href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezioni[i]+'"><h3>'+sezioni[i]+'</h3></a></div>'
        }
        return ret;
    },
    printStudenti:function (annoScolastico,materia,classe,sezione,studenti){
      console.log("in printStudenti\nstudenti = \n\n" + studenti + "\n\n")
        let ret = "";
        for(let i=0;i<studenti.length;i++){
            if( (i+2)%2 === 0){
                ret +='<div class="col-sm-5 gray">'
            }
            else{
                ret+='<div class="col-sm-5 col-sm-offset-1 gray">'
            }
            ret+='<a class="centered" href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezione+'/'+studenti[i].nome+'/'+studenti[i].cognome+'/'+studenti[i].id+'"><h3>'+studenti[i].nome+' '+studenti[i].cognome+'</h3></a></div>'
        }
        return ret;
    },
    printPagelle: function (annoScolastico,materia,classe,sezione,studente,pagellaPrimoSemestre,pagellaSecondoSemestre){
        let ret = "";

        //Prima Area testo
        ret += '<div class="textareaContainer"><p class="myP">Primo Semestre</p>';
        ret += '<button class="glyphRight btn-blue" onclick="collapseForm(\'textArea_1\')"><span class="glyphicon glyphicon-menu-down"></span></button>';
        ret += '<form id="textArea_1"><textarea class="myTextArea" name="1">';
        ret += pagellaPrimoSemestre;
        ret += '</textarea><br><button type="button" class="btn btn-md btn-blue btn1" id="1" onclick="savePagella(\''+annoScolastico+'\',\''+materia+'\',\''+classe+'\',\''+sezione+'\',\''+studente.nome+'\',\''+studente.cognome+'\',\''+studente.id+'\',1,this)">Save</button></form>';

        //Seconda Area testo
        ret += '</div><br><div class="textareaContainer"><p class="myP">Secondo Semestre</p>';
        ret += '<button class="glyphRight btn-blue" onclick="collapseForm(\'textArea_2\')"><span class="glyphicon glyphicon-menu-down"></span></button>';
        ret += '<form id="textArea_2"><textarea class="myTextArea" name="2">';
        ret += pagellaSecondoSemestre;
        ret+='</textarea><br><button type="button" class="btn btn-md btn-blue btn1" onclick="savePagella(\''+annoScolastico+'\',\''+materia+'\',\''+classe+'\',\''+sezione+'\',\''+studente.nome+'\',\''+studente.cognome+'\',\''+studente.id+'\',2,this)" id="2">Save</button></form>';
        ret +='</div>';

        return ret;
    },
    //--------------------------------- END ------------------------------------


    //---------------------- HELPERS AREA AMMINISTRATORE -----------------------
    printAnniGestione:function (anniScolastici){
        let ret= "";
        let reqUrlCreazioneNuovoAnnoScolastico = "/admin/gestioneAnni/creaNuovoAnnoScolastico";
        let titleModaleNuovoAnnoScolastico = "Crea Nuovo Anno Scolastico";
        ret += "<div class='row'>";
        for(let i=0;i<anniScolastici.length;i++){

            let formActionModaleStampa = "/admin/stampaPDF/stampaAnnoScolastico/" + anniScolastici[i].nome ;
            let titleModaleStampa = "Stampa Anno " + anniScolastici[i].nome;

            let formActionModaleGestione = "/admin/gestioneAnni/modificaAnnoScolastico/" + anniScolastici[i].nome ;
            let titleModaleGestione = "Gestione Anno " + anniScolastici[i].nome;

            if( (i+2)%2 === 0 ){
                ret+= '<div class="col-sm-12 col-md-5 gray">';
            }
            else{
                ret +='<div class="col-sm-12 col-md-5 col-md-offset-1 gray">';
            }
            ret += '<a href="/admin/gestioneAnni/'+anniScolastici[i].nome+'"><h3>'+anniScolastici[i].nome+'</h3></a>';
            ret += '<button type="button" class="btn btn-md btn-right4 btn-blue" onclick="openModaleGestioneAnnoScolastico(\''+anniScolastici[i].nome+'\',\''+formActionModaleGestione+'\',\''+titleModaleGestione+'\')" ><span class="glyphicon glyphicon-cog blue"></span></button>';
            ret += '<button class="btn btn-md btn-right5 btn-blue" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"><span class="glyphicon glyphicon-print blue"></span></button>';
            ret += '</div>';

        }
        if(anniScolastici.length === 0 || (anniScolastici.length) % 2 === 0){
            ret +='<div class="col-sm-12 col-md-5 gray">';
        }
        else{

            ret+='<div class="col-sm-12 col-md-5 col-md-offset-1 gray">';
        }
        ret+='<a id="btnNuovoAnnoScolastico" onclick="openModaleNuovoAnnoScolastico(\''+ reqUrlCreazioneNuovoAnnoScolastico +'\',\''+ titleModaleNuovoAnnoScolastico +'\')"><h3>Nuovo Anno</h3></a></div>';
        ret+='</div></div>';
        return ret;
    },
    printClassiGestione:function (annoScolastico,classi) {
        let ret= '';
        let reqUrlCreazioneNuovaClasse = "/admin/gestioneAnni/creaNuovaClasse/" + annoScolastico;
        let titleModaleNuovaClasse = "Crea Nuova Classe";

        ret += '<div class="row">';
        for(let i = 0; i < classi.length; i++){
          let formActionModaleGestione = "/admin/gestioneAnni/modificaClasse/" + annoScolastico + "/" + classi[i];
          let titleModaleGestione = "Gestione Classe " + classi[i];
          let formActionModaleStampa = "/admin/stampaPDF/stampaClasse/"  + annoScolastico + "/" + classi[i];
          let titleModaleStampa = "Stampa Classe " + classi[i];
          if( (i+3)%3 === 0 ){
              ret+= '<div class="col-sm-12 col-md-3 gray">';
          }
          else{
              ret +='<div class="col-sm-12 col-md-3 col-md-offset-1 gray">';
          }
          ret+= '<a href="/admin/gestioneAnni/'+annoScolastico+'/' + classi[i]+'"><h3>Classe '+classi[i]+'</h3></a>';
          ret+= '<button class="btn btn-md btn-right3" onclick="openModaleGestioneClasse(\''+annoScolastico +'\',\''+classi[i]+'\',\'' +formActionModaleGestione+'\',\''+titleModaleGestione+'\')"><span class="glyphicon glyphicon-cog blue"></span></button>';
          ret+= '<button title="Print" class="btn btn-md btn-right2" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <span class="glyphicon glyphicon-print blue"></span></button>';
          ret+= '</div>';
          if( (i+1)%3 === 0){
              ret+= '</div><div class="row">';
          }
        }
        if( (classi.length)%3 === 0){
            ret+='<div class="col-sm-12 col-md-3 gray">';
        }
        else{
            if( (classi.length)%2 === 2){
                ret+='<div class="col-sm-12 col-md-3 col-md-offset-2 gray">';
            }
            else{
                ret+='<div class="col-sm-12 col-md-3 col-md-offset-1 gray">';
            }
        }
        ret+='<a id="btnNuovaClasse" onclick="openModaleNuovaClasse(\''+reqUrlCreazioneNuovaClasse+'\',\''+titleModaleNuovaClasse+'\')"><h3>Aggiungi Classe</h3></a></div>';
        ret+='</div>';

        return ret;
    },
    printSezioniGestione:function (annoScolastico,classe,sezioni){
      let ret = '';
      let reqUrlCreazioneNuovaSezione = "/admin/gestioneAnni/creaNuovaSezione/" + annoScolastico + "/" + classe;
      let titleModaleNuovaSezione = "Crea Nuova Sezione";

      ret += '<div class="row">';
      for(let i = 0; i < sezioni.length; i++){
        let formActionModaleStampa = "/admin/stampaPDF/stampaSezione/" + annoScolastico + "/" + classe + "/" + sezioni[i];
        let formActionModaleGestione = "/admin/gestioneAnni/modificaSezione/" + annoScolastico + "/" + classe + "/" + sezioni[i];

        let titleModaleStampa = "Stampa Sezione " + sezioni[i];
        let titleModaleGestione = "Gestione Sezione " + sezioni[i];
        if( (i+3)%3 === 0 ){
            ret+= '<div class="col-sm-12 col-md-3 gray">';
        }
        else{
            ret +='<div class="col-sm-12 col-md-3 col-md-offset-1 gray">';
        }
        ret+= '<a href="/admin/gestioneAnni/' + annoScolastico + '/' + classe + '/'+ sezioni[i] + '"><h3>Sezione '+sezioni[i]+'</h3></a>';
        ret+= '<button class="btn btn-md btn-right3" onclick="openModaleGestioneSezione(\''+annoScolastico +'\',\''+classe+'\',\''+sezioni[i]+'\', \'' +formActionModaleGestione+'\',\''+titleModaleGestione+'\')"><span class="glyphicon glyphicon-cog blue"></span></button>';
        ret+= '<button title="Print" class="btn btn-md btn-right2" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <span class="glyphicon glyphicon-print blue"></span></button>';
        ret+= '</div>';
        if( (i+1)%3 === 0){
            ret+= '</div><div class="row">';
        }
      }
      if( (sezioni.length)%3 === 0){
          ret+='<div class="col-sm-12 col-md-3 gray">';
      }
      else{
          if( (sezioni.length)%2 === 2){
              ret+='<div class="col-sm-12 col-md-3 col-md-offset-2 gray">';
          }
          else{
              ret+='<div class="col-sm-12 col-md-3 col-md-offset-1 gray">';
          }
      }
      ret+='<a id="btnNuovaClasse" onclick="openModaleNuovaSezione(\''+reqUrlCreazioneNuovaSezione+'\',\''+titleModaleNuovaSezione+'\')"><h3>Aggiungi Sezione</h3></a></div>';
      ret+='</div>';

      return ret;
    },
    printStudentiGestione:function (annoScolastico,classe,sezione,studenti){
      let ret = '';
      let reqUrlCreazioneNuovoStudente = "/admin/gestioneAnni/creaNuovoStudente/" + annoScolastico + "/" + classe + "/" + sezione;
      let titleModaleNuovoStudente = "Crea Nuova Studente";

      ret += '<div class="row">'
      for(let i = 0; i < studenti.length; i++){
        //console.log(JSON.stringify(studenti[i]))
        let formActionModaleStampa = "/admin/stampaPDF/stampaStudente/" + annoScolastico + "/" + classe + "/" + sezione + "/" + studenti[i].id;
        let formActionModaleGestione = "/admin/gestioneAnni/modificaStudente/" + annoScolastico + "/" + classe + "/" + sezione + "/" + studenti[i].id;

        let titleModaleStampa = "Stampa Studente " + studenti[i].nome + " " + studenti[i].cognome + " " + studenti[i].id;
        let titleModaleGestione = "Gestione Studente " + studenti[i].nome + " " + studenti[i].cognome;
        if( (i+3)%3 === 0 ){
            ret+= '<div class="col-sm-12 col-md-3 gray">';
        }
        else{
            ret +='<div class="col-sm-12 col-md-3 col-md-offset-1 gray">';
        }
        ret+= '<a href="#"><h3>'+studenti[i].nome +" " +studenti[i].cognome+'</h3></a>';
        ret+= '<button class="btn btn-md btn-right3" onclick="openModaleGestioneStudente( \''+annoScolastico +'\' , \''+classe+'\' , \''+sezione+'\' , \''+studenti[i].nome+'\' , \''+studenti[i].cognome+'\' , \''+studenti[i].id+'\' , \''+formActionModaleGestione+'\' , \''+titleModaleGestione+'\' )"><span class="glyphicon glyphicon-cog blue"></span></button>';
        ret+= '<button title="Print" class="btn btn-md btn-right2" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <span class="glyphicon glyphicon-print blue"></span></button>';
        ret+= '</div>';
        if( (i+1)%3 === 0){
            ret+= '</div><div class="row">';
        }
      }
      if( (studenti.length)%3 === 0){
          ret+='<div class="col-sm-12 col-md-3 gray">';
      }
      else{
          if( (studenti.length)%2 === 2){
              ret+='<div class="col-sm-12 col-md-3 col-md-offset-2 gray">';
          }
          else{
              ret+='<div class="col-sm-12 col-md-3 col-md-offset-1 gray">';
          }
      }
      ret+='<a id="btnNuovaClasse" onclick="openModaleNuovoStudente(\''+reqUrlCreazioneNuovoStudente+'\',\''+titleModaleNuovoStudente+'\')"><h3>Aggiungi Studente</h3></a></div>';
      ret+='</div>';

      return ret;
    }
    //--------------------------------- END ------------------------------------

};
//----------------------------------- END --------------------------------------




//---------------------------- EXPORT DEL MODULO -------------------------------
module.exports = handlebarsHelpers;
//----------------------------------- END --------------------------------------
