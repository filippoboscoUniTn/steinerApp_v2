"use strict";

//-------------------------------- PACKAGES ------------------------------------
const path = require('path');
const util = require('util');
//----------------------------------- END --------------------------------------



//--------------------- HANDLEBARS HELPER FUNCTIONS ----------------------------
let handlebarsHelpers = {

    //------------------------- HELPERS AREA UTENTE ----------------------------
    printAnniScolastici:function (anniScolastici){
        let ret='';
        if(anniScolastici != null){
            for(let i=0;i<anniScolastici.length;i++){
                if( (i+2)%2===0){
                  ret += '<div class="row mt-2">'
                    ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                      ret+='<a href="/pagelle/annoScolastico/'+anniScolastici[i].nome+'" class="h4 text-center text-primary">'+anniScolastici[i].nome+'</a>'
                    ret+='</div>'
                }
                else{
                    ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                      ret+='<a href="/pagelle/annoScolastico/'+anniScolastici[i].nome+'" class="h4 text-center text-primary">'+anniScolastici[i].nome+'</a>'
                    ret+='</div>'
                  ret+='</div>'
                }
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
                  ret += '<div class="row mt-2">'
                    ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                      ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+ materie[i] +'" class="h4 text-center text-primary">'+materie[i]+'</a>'
                    ret+='</div>'
                }
                else{
                    ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                      ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+ materie[i] +'" class="h4 text-center text-primary">'+materie[i]+'</a>'
                    ret+='</div>'
                  ret+='</div>'
                }
            }
        }
        return ret;
    },
    printClassi:function (annoScolastico,materia,classi){
        let ret = "";
        for(let i = 0; i<classi.length; i++){
            if( (i+2)%2 === 0 ){
              ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classi[i]+'" class="h4 text-center text-primary">'+classi[i]+'</a>'
                ret+='</div>'
            }
            else{
              ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classi[i]+'" class="h4 text-center text-primary">'+classi[i]+'</a>'
              ret+='</div>'
            ret+='</div>'
            }
        }
        return ret;
    },
    printSezioni:function (annoScolastico,materia,classe,sezioni){
        let ret = "";
        for(let i=0;i<sezioni.length;i++){
            if((i+2)%2 === 0){
              ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezioni[i]+'" class="h4 text-center text-primary">'+sezioni[i]+'</a>'
                ret+='</div>'
            }
            else{
              ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezioni[i]+'" class="h4 text-center text-primary">'+sezioni[i]+'</a>'
              ret+='</div>'
            ret+='</div>'
            }
        }
        return ret;
    },
    printStudenti:function (annoScolastico,materia,classe,sezione,studenti){
        let ret = "";
        for(let i=0;i<studenti.length;i++){
            if( (i+2)%2 === 0){
              ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezione+'/'+studenti[i].nome+'/'+studenti[i].cognome+'/'+studenti[i].id+'" class="h4 text-center text-primary">'+studenti[i].nome+ ' ' + studenti[i].cognome+'</a>'
                ret+='</div>'
            }
            else{
              ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                ret+='<a href="/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezione+'/'+studenti[i].nome+'/'+studenti[i].cognome+'/'+studenti[i].id+'" class="h4 text-center text-primary">'+studenti[i].nome + ' ' + studenti[i].cognome+'</a>'
              ret+='</div>'
            ret+='</div>'
            }
        }
        return ret;
    },
    printPagelle: function (annoScolastico,materia,classe,sezione,studente,pagellaPrimoSemestre,pagellaSecondoSemestre){
        let ret = "";
        //--------------------------- PRIMO SEMESTRE ---------------------------
        ret += '<div class="row">'
          ret += '<div class="col-sm-12 col-lg-11 offset-lg-1 mt-2">';
            ret += '<button class="btn btn-sm btn-danger float-right position-relative mr-0" onclick="collapseForm(\'textArea_1\')">&times</button>';
            ret += '<p class="h4 text-primary mt-2">Primo Semestre</p>'
            ret += '<form id="textArea_1">'
              ret += '<textarea class="text-area-xxl w-100" name="1">'
                ret += pagellaPrimoSemestre;
              ret += '</textarea>'
              ret += '<button type="button" class="btn btn-md btn-success my-2" id="1" onclick="savePagella(\''+annoScolastico+'\',\''+materia+'\',\''+classe+'\',\''+sezione+'\',\''+studente.nome+'\',\''+studente.cognome+'\',\''+studente.id+'\',1,this)">Save</button>'
            ret +='</form>'
          ret += '</div>'
        ret += '</div>'
        //--------------------------------- END --------------------------------

        //--------------------------- SECONDO SEMESTRE ---------------------------
        ret += '<div class="row">'
          ret += '<div class="col-sm-12 col-lg-11 offset-lg-1 mt-2">';
            ret += '<button class="btn btn-sm btn-danger float-right position-relative mr-0" onclick="collapseForm(\'textArea_2\')">&times</button>';
            ret += '<p class="h4 text-primary mt-2">Secondo Semestre</p>'
            ret += '<form id="textArea_2">'
              ret += '<textarea class="text-area-xxl w-100" name="1">'
                ret += pagellaSecondoSemestre;
              ret += '</textarea>'
              ret += '<button type="button" class="btn btn-md btn-success my-2" id="1" onclick="savePagella(\''+annoScolastico+'\',\''+materia+'\',\''+classe+'\',\''+sezione+'\',\''+studente.nome+'\',\''+studente.cognome+'\',\''+studente.id+'\',1,this)">Save</button>'
            ret +='</form>'
          ret += '</div>'
        ret += '</div>'
        //--------------------------------- END --------------------------------

        return ret;
    },
    //--------------------------------- END ------------------------------------


    //------------------------ HELPERS GESTIONE ANNI ---------------------------
    printAnniGestione:function (anniScolastici){
        let ret= "";
        let reqUrlCreazioneNuovoAnnoScolastico = "/admin/gestioneAnni/creaNuovoAnnoScolastico";
        let titleModaleNuovoAnnoScolastico = "Crea Nuovo Anno Scolastico";

        for(let i=0;i<anniScolastici.length;i++){

            let formActionModaleStampa = "/admin/stampaPDF/stampaAnnoScolastico/" + anniScolastici[i].nome ;
            let titleModaleStampa = "Stampa Anno " + anniScolastici[i].nome;

            let formActionModaleGestione = "/admin/gestioneAnni/modificaAnnoScolastico/" + anniScolastici[i].nome ;
            let titleModaleGestione = "Gestione Anno " + anniScolastici[i].nome;

            if( (i+2)%2 === 0 ){
              ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret+='<a href="/admin/gestioneAnni/'+anniScolastici[i].nome+'"class="h4 text-center text-primary">'+anniScolastici[i].nome+'</a>'
                  ret += '<button type="button" class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneAnnoScolastico(\''+anniScolastici[i].nome+'\',\''+formActionModaleGestione+'\',\''+titleModaleGestione+'\')" ><i class="fas fa-cogs text-white"></i></button>';
                  ret += '<button class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"><i class="fas fa-print text-white"></i></button>';
                ret+='</div>'
            }
            else{
              ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                ret+='<a href="/admin/gestioneAnni/'+anniScolastici[i].nome+'"class="h4 text-center text-primary">'+anniScolastici[i].nome+'</a>'
                ret += '<button type="button" class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneAnnoScolastico(\''+anniScolastici[i].nome+'\',\''+formActionModaleGestione+'\',\''+titleModaleGestione+'\')" ><i class="fas fa-cogs text-white"></i></button>';
                ret += '<button class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"><i class="fas fa-print text-white"></i></button>';
              ret+='</div>'
            ret+='</div>'
            }
        }
        if(anniScolastici.length % 2 === 0){
          ret += '<div class="row mt-2">'
          ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
        }
        else{
          ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
        }
        // ret += '<button class="btn btn-success btn-lg mt-3" data-toggle="modal" data-target="#modaleNuovaClasse">Crea Nuova Classe</button>'
        ret+='<a class="h3 text-primary" href="#" id="btnNuovoAnnoScolastico" onclick="openModaleNuovoAnnoScolastico(\''+ reqUrlCreazioneNuovoAnnoScolastico +'\',\''+ titleModaleNuovoAnnoScolastico +'\')">Nuovo Anno</a></div>';
        ret+='</div></div>';

        return ret;
    },
    printClassiGestione:function (annoScolastico,classi) {
      classi.sort();
      let ret= "";
      let reqUrlCreazioneNuovaClasse = "/admin/gestioneAnni/creaNuovaClasse/" + annoScolastico;
      let titleModaleNuovaClasse = "Crea Nuova Classe";

      for(let i=0;i<classi.length;i++){

        let formActionModaleStampa = "/admin/stampaPDF/stampaClasse/"  + annoScolastico + "/" + classi[i];
        let titleModaleStampa = "Stampa Classe " + classi[i];

        let formActionModaleGestione = "/admin/gestioneAnni/modificaAnnoScolastico/" + classi[i];
        let titleModaleGestione = "Gestione Classe " + classi[i];

          if( (i+2)%2 === 0 ){
            ret += '<div class="row mt-2">'
              ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
              ret+= '<a href="/admin/gestioneAnni/'+annoScolastico+'/' + classi[i]+'" class="h4 text-center text-primary" >Classe '+classi[i]+'</a>';
                ret += '<button type="button" class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneClasse(\''+annoScolastico+'\',\''+classi[i]+'\',\''+formActionModaleGestione+'\',\''+titleModaleGestione+'\')" ><i class="fas fa-cogs text-white"></i></button>';
                ret += '<button class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"><i class="fas fa-print text-white"></i></button>';
              ret+='</div>'
          }
          else{
            ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
            ret+= '<a href="/admin/gestioneAnni/'+annoScolastico+'/' + classi[i]+'" class="h4 text-center text-primary" >Classe '+classi[i]+'</a>';
              ret += '<button type="button" class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneClasse(\''+annoScolastico+'\',\''+classi[i]+'\',\''+formActionModaleGestione+'\',\''+titleModaleGestione+'\')" ><i class="fas fa-cogs text-white"></i></button>';
              ret += '<button class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"><i class="fas fa-print text-white"></i></button>';
            ret+='</div>'
          ret+='</div>'
          }
      }
      if(classi.length % 2 === 0){
        ret += '<div class="row mt-2">'
        console.log("%2 == 0");
        ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
      }
      else{
        ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
      }
      // ret += '<button class="btn btn-success btn-lg mt-3" data-toggle="modal" data-target="#modaleNuovaClasse">Crea Nuova Classe</button>'
      ret+='<a class="h3 text-primary" href="#" id="btnNuovaClasse" onclick="openModaleNuovaClasse(\''+ reqUrlCreazioneNuovaClasse +'\',\''+ titleModaleNuovaClasse +'\')">Nuova Classe</a></div>';
      ret+='</div></div>';

      return ret;
    },
    printSezioniGestione:function (annoScolastico,classe,sezioni){
      sezioni.sort();
      let ret= "";
      let reqUrlCreazioneNuovaSezione = "/admin/gestioneAnni/creaNuovaSezione/" + annoScolastico + "/" + classe;
      let titleModaleNuovaSezione = "Crea Nuova Sezione";

      for(let i=0;i<sezioni.length;i++){

        let formActionModaleStampa = "/admin/stampaPDF/stampaSezione/" + annoScolastico + "/" + classe + "/" + sezioni[i];
        let formActionModaleGestione = "/admin/gestioneAnni/modificaSezione/" + annoScolastico + "/" + classe + "/" + sezioni[i];

        let titleModaleStampa = "Stampa Sezione " + sezioni[i];
        let titleModaleGestione = "Gestione Sezione " + sezioni[i];

          if( (i+2)%2 === 0 ){
            ret += '<div class="row mt-2">'
              ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                ret+= '<a href="/admin/gestioneAnni/' + annoScolastico + '/' + classe + '/'+ sezioni[i] + '" class="h4 text-center text-primary">Sezione '+sezioni[i]+'</a>';
                ret+= '<button class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneSezione(\''+annoScolastico +'\',\''+classe+'\',\''+sezioni[i]+'\', \'' +formActionModaleGestione+'\',\''+titleModaleGestione+'\')"><i class="fas fa-cogs text-white"></i></button>';
                ret+= '<button title="Print" class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <i class="fas fa-print text-white"></i></button>';
              ret+='</div>'
          }
          else{
            ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
              ret+= '<a href="/admin/gestioneAnni/' + annoScolastico + '/' + classe + '/'+ sezioni[i] + '" class="h4 text-center text-primary">Sezione '+sezioni[i]+'</a>';
              ret+= '<button class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneSezione(\''+annoScolastico +'\',\''+classe+'\',\''+sezioni[i]+'\', \'' +formActionModaleGestione+'\',\''+titleModaleGestione+'\')"><i class="fas fa-cogs text-white"></i></button>';
              ret+= '<button title="Print" class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <i class="fas fa-print text-white"></i></button>';
            ret+='</div>'
          ret+='</div>'
          }
      }
      if(sezioni.length % 2 === 0){
        ret += '<div class="row mt-2">'
        ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
      }
      else{
        ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
      }
      // ret += '<button class="btn btn-success btn-lg mt-3" data-toggle="modal" data-target="#modaleNuovaClasse">Crea Nuova Classe</button>'
      ret+='<a class="h3 text-primary" href="#" id="btnNuovaSezione" onclick="openModaleNuovaSezione(\''+reqUrlCreazioneNuovaSezione+'\',\''+titleModaleNuovaSezione+'\')"><h3>Aggiungi Sezione</h3></a></div>';
      ret+='</div></div>';

      return ret;
    },
    printStudentiGestione:function (annoScolastico,classe,sezione,studenti){
      studenti.sort();
      let ret= "";
      let reqUrlCreazioneNuovoStudente = "/admin/gestioneAnni/creaNuovoStudente/" + annoScolastico + "/" + classe + "/" + sezione;
      let titleModaleNuovoStudente = "Crea Nuova Studente";

      for(let i=0;i<studenti.length;i++){

        let formActionModaleStampa = "/admin/stampaPDF/stampaStudente/" + annoScolastico + "/" + classe + "/" + sezione + "/" + studenti[i].id;
        let formActionModaleGestione = "/admin/gestioneAnni/modificaStudente/" + annoScolastico + "/" + classe + "/" + sezione + "/" + studenti[i].id;

        let titleModaleStampa = "Stampa Studente " + studenti[i].nome + " " + studenti[i].cognome + " " + studenti[i].id;
        let titleModaleGestione = "Gestione Studente " + studenti[i].nome + " " + studenti[i].cognome;

          if( (i+2)%2 === 0 ){
            ret += '<div class="row mt-2">'
              ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                ret+= '<p class="h3 text-primary">'+studenti[i].nome +" " +studenti[i].cognome +'</p>'
                ret+= '<button class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneStudente( \''+annoScolastico +'\' , \''+classe+'\' , \''+sezione+'\' , \''+studenti[i].nome+'\' , \''+studenti[i].cognome+'\' , \''+studenti[i].id+'\' , \''+formActionModaleGestione+'\' , \''+titleModaleGestione+'\' )"><i class="fas fa-cogs text-white"></i></button>';
                ret+= '<button title="Print" class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <i class="fas fa-print text-white"></i></button>';
              ret+='</div>'
          }
          else{
            ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
            ret+= '<p class="h3 text-primary">'+studenti[i].nome +" " +studenti[i].cognome +'</p>';
            ret+= '<button class="btn btn-md float-right ml-3 bg-primary" onclick="openModaleGestioneStudente( \''+annoScolastico +'\' , \''+classe+'\' , \''+sezione+'\' , \''+studenti[i].nome+'\' , \''+studenti[i].cognome+'\' , \''+studenti[i].id+'\' , \''+formActionModaleGestione+'\' , \''+titleModaleGestione+'\' )"><i class="fas fa-cogs text-white"></i></button>';
            ret+= '<button title="Print" class="btn btn-md float-right bg-primary" onclick="openModaleStampa(\''+formActionModaleStampa+'\',\''+titleModaleStampa+'\')"> <i class="fas fa-print text-white"></i></button>';
            ret+='</div>'
          ret+='</div>'
          }
      }
      if(studenti.length % 2 === 0){
        ret += '<div class="row mt-2">'
        ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
      }
      else{
        ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
      }
      // ret += '<button class="btn btn-success btn-lg mt-3" data-toggle="modal" data-target="#modaleNuovaClasse">Crea Nuova Classe</button>'
      ret+='<a class="h3 text-primary" href="#" id="btnNuovoStudente" onclick="openModaleNuovoStudente(\''+reqUrlCreazioneNuovoStudente+'\',\''+titleModaleNuovoStudente+'\')"><h3>Aggiungi Studente</h3></a></div>';
      ret+='</div></div>';

      return ret;

    },
    //------------------------------------ END ---------------------------------

    //------------------------ HELPERS GESTIONE UTENTI -------------------------
    printUtentiGestione:function(utenti,admins){
      let ret = '';
      if(admins != null){
        ret += '<br>'
        ret += '<p class="offset-1 h5 mt-2"> Amministratori'
          for(let i=0;i<admins.length;i++){
              if( (i+2)%2 === 0 ){
                ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret+='<a class="h4 text-center text-primary" href="/admin/gestioneUtenti/utente/'+admins[i].id+'"><h3>'+admins[i].nome+' '+admins[i].cognome+'</h3></a>';
                ret+='</div>'
              }
              else{
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                  ret+='<a class="h4 text-center text-primary" href="/admin/gestioneUtenti/utente/'+admins[i].id+'"><h3>'+admins[i].nome+' '+admins[i].cognome+'</h3></a>';
                  ret+='</div>'
                ret+='</div>'
              }
          }
          if(admins.length%2 !=0){
            ret += '</div>'
          }
      }
      ret += '<br>'
      ret += '<div class="w-100"></div>'
      if(utenti != null){
          ret += '<p class="offset-1 h5 mt-2"> Insegnati'
          for(let i=0;i<utenti.length;i++){
              if( (i+2)%2===0){
                ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret+='<a class="h4 text-center text-primary" href="/admin/gestioneUtenti/utente/'+utenti[i].id+'"><h3>'+utenti[i].nome+' '+utenti[i].cognome+'</h3></a>';
                ret+='</div>'
              }
              else{
                ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                  ret+='<a class="h4 text-center text-primary" href="/admin/gestioneUtenti/utente/'+utenti[i].id+'"><h3>'+utenti[i].nome+' '+utenti[i].cognome+'</h3></a>';
                  ret+='</div>'
                ret+='</div>'
              }
          }
          if(utenti.length%2 !=0){
            ret += '</div>'
          }
      }
      // console.log("ret = " + ret)
      return ret;
    },
    printUtenteGestione:function(utente,permessi){
      let ret='<br>';
      ret += '<p class="offset-1 h5 mt-2"> Anni Scolastici'
      if(permessi != null){
          for(let i=0;i<permessi.length;i++){
              if( (i)%2===0 || i==0){
                ret += '<div class="row mt-2">'
                ret+='<div class="col-sm-12 col-lg-4 offset-lg-1 gray">';
                  ret += '<a class="h4 text-center text-primary" href="/admin/gestioneUtenti/utente/'+utente.id+'/permessi/'+permessi[i].nome+'"><h3>'+permessi[i].nome+'</h3>'
                ret+='</div>'
              }
              else{
                ret+='  <div class="col-sm-12 col-lg-4 offset-lg-2 gray">';
                  ret += '<a class="h4 text-center text-primary" href="/admin/gestioneUtenti/utente/'+utente.id+'/permessi/'+permessi[i].nome+'"><h3>'+permessi[i].nome+'</h3>'
                  ret+='</div>'
                ret+='</div>'
              }
          }
          if(permessi.length%2!=0){
            ret += '</div>'
          }
      }
      return ret;
    },
    //RIFARE IN ACCORDO CON I PERMESSI V.2
    printPermessiGestione:function(utente,permessiAnno){
      let ret='<br>';
      ret += '<p class="offset-md-1 h5 mt-2"> Permessi Utente';
      for(let i=0;i<permessiAnno[0].permessi.length;i++){
        let deleteParams;
        if((i+2)%2===0){
          ret += '<div class="row">'
          ret += '<div class="col-sm-12 col-md-4 offset-md-1 gray-xl"><h4>'+permessiAnno[0].permessi[i].materia+'</h4>'
            ret += '<form action="/" method="POST" class="form-inline">'
                for(let c=0;c<8;c++){
                  ret += '<div class="form-check form-check-inline">';
                    ret += '<input class="form-check-input" type="checkbox" value="'+(c+1)+'" id="defaultCheck'+c+ '"';
                    if(permessiAnno[0].permessi[i].classi.indexOf((c+1)) !== -1 ){
                      ret += ' checked>';
                    }
                    else{
                      ret += '>';
                    }
                    ret += '<label class="form-check-label" for="defaultCheck'+c+'">'+ (c+1) + '</label>'
                  ret += '</div>'
                }
                ret+="<div class='w-100'></div>"
                ret+= '<button class="btn btn-sm btn-success mt-3" type="submit">Salva</button>'
                ret+= '<button class="btn btn-sm btn-danger mt-3 ml-2" type="button" onclick="eliminaPermesso('+deleteParams+')">Elimina</button>'
            ret += '</form>'
        ret +='</div>'
        }
        else{
          ret += '<div class="col-sm-12 col-md-4 offset-md-1 gray-xl"><h4>'+permessiAnno[0].permessi[i].materia+'</h4>'
            ret += '<form action="/" method="POST" class="form-inline">'
                for(let c=0;c<8;c++){
                  ret += '<div class="form-check form-check-inline">';
                    ret += '<input class="form-check-input" type="checkbox" value="' +(c+1)+ '" id="defaultCheck' +c+ '"';
                    if(permessiAnno[0].permessi[i].classi.indexOf((c+1)) !== -1 ){
                      ret += ' checked>';
                    }
                    else{
                      ret += '>';
                    }
                    ret += '<label class="form-check-label" for="defaultCheck'+c+'">'+ (c+1) + '</label>'
                  ret += '</div>'
                }
                ret+="<div class='w-100'></div>"
                ret+= '<button class="btn btn-sm btn-success mt-3" type="submit">Salva</button>'
                ret+= '<button class="btn btn-sm btn-danger mt-3 ml-2" type="button" onclick="eliminaPermesso()">Elimina</button>'
            ret += '</form>'
        ret +='</div>'
        ret += '</div>'
        }
      }
      let titleModalePermesso = "Creazione Nuovo Permesso";
      let formActionModalePermesso = "/admin/gestioneUtenti/creaPermesso/"+utente.id+"/"+permessiAnno[0].annoScolastico;
      if(permessiAnno[0].permessi.length%2 != 0){
        ret += '<div class="col-sm-12 col-md-4 offset-md-1 gray-xl">'
          ret += '<a href="#" class="h3 text-primary align-middle" onclick="openModaleCreaPermesso(\''+titleModalePermesso+'\',\''+formActionModalePermesso+'\')">Aggiungi Permesso</a>';
        ret += '</div>'
      ret += '</div>';
      }
      else{
      ret += '<div class="row mt-2">'
        ret += '<div class="col-sm-12 col-md-4 offset-md-1 gray-xl">'
          ret += '<a href="#" class="h3 text-primary align-middle" onclick="openModaleCreaPermesso(\''+titleModalePermesso+'\',\''+formActionModalePermesso+'\')">Aggiungi Permesso</a>';
        ret += '</div>'
      ret += '</div>';
      }
      return ret;
    },
    printInfoUtente:function(utente){
      let formAction = "/admin/gestioneUtenti/utente/"+utente.id+"/infoUtente"
      let ret ='';
      ret += '<br>'
      ret += '<p class="offset-md-1 h5 mt-2">'

      ret += '<form method="POST" action="'+formAction+'">'

        //------------------------------- NOME - COGNOME -----------------------
        ret += '<div class="form-row">'
          ret += '<div class="col-sm-10 offset-sm-1 col-md-3 offset-md-2">'
            ret += '<label for="nome">Nome</label>'
            ret += '<input id="nome" name="nome" type="text" class="form-control" placeholder="Nome" value="'+utente.nome+'">'
          ret += '</div>'
          ret += '<div class="col-sm-10 offset-sm-1 col-md-3">'
            ret += '<label for="cognome">Cognome</label>'
            ret += '<input id="cognome" name="cognome" type="text" class="form-control" placeholder="Cognome" value="'+utente.cognome+'">'
          ret += '</div>'
        ret += '</div>'
        //-------------------------------- END ---------------------------------

        ret += '<br>'

        //----------------------------- EMAIL - USERNAME -----------------------
        ret += '<div class="form-row">'
          ret += '<div class="col-sm-10 offset-sm-1 col-md-3 offset-md-2">'
            ret += '<label for="email">Email</label>'
            ret += '<input id="email" name="email" type="text" class="form-control" placeholder="Email" value="'+utente.email+'">'
          ret += '</div>'
          ret += '<div class="col-sm-10 offset-sm-1 col-md-3">'
            ret += '<label for="username">Username</label>'
            ret += '<input id="username" name="username" type="text" class="form-control" placeholder="Username" value="'+utente.username+'">'
          ret += '</div>'
        ret += '</div>'
        //-------------------------------- END ---------------------------------

        ret += '<br>'

        //----------------------- AUTHORIZATION - STATUS -----------------------
        ret += '<div class="form-row">'
          ret += '<div class="col-sm-10 offset-sm-1 col-md-3 offset-md-2">'
            ret += '<label for="auth">Autorizzazione</label>'
            ret += '<select id="auth" name="authorization" class="form-control">'
              if(utente.authorization === 'ADMIN'){
                ret += '<option value="ADMIN" selected>Amministratore</option>'
                ret += '<option value="TEACHER">Insegnante</option>'
              }
              else{
                ret += '<option value="ADMIN">Amministratore</option>'
                ret += '<option value="TEACHER" selected>Insegnante</option>'
              }
            ret += '</select>'
          ret += '</div>'

          ret += '<div class="col-sm-10 offset-sm-1 col-md-3">'
          ret += '<label for="status">Stato Utente</label>'
          ret += '<select id="status" name="status" class="form-control">'
            if(utente.status === 'PENDING'){
              ret += '<option value="PENDING" selected>Bloccato</option>'
              ret += '<option value="ACCEPTED">Attivo</option>'

            }
            else{
              ret += '<option value="PENDING">Bloccato</option>'
              ret += '<option value="ACCEPTED" selected>Attivo</option>'
            }
            ret += '</select>'
          ret += '</div>'
        ret += '</div>'
        //-------------------------------- END ---------------------------------

        ret += '<br>'
        ret += '<br>'

        //-------------------------------- BOTTONI -----------------------------
        ret += '<div class="form-row">'
          ret += '<div class="col-sm-10 offset-sm-1 col-md-3 offset-md-2">'
          ret += '<button class="btn btn-lg btn-success mb-2" type="submit"> Salva </button>'
          ret += '<button class="btn btn-lg btn-danger ml-2 mb-2" type="button" onclick="deleteUtente(\''+utente.id+'\')"> Elimina </button>'
          ret += '</div>'
        ret += '</div>'
        //-------------------------------- END ---------------------------------
        ret+= '<input type="hidden" value="'+utente.id+'" name="userID">'
      ret += '</form>'



      return ret;

    },
    //--------------------------------- END ------------------------------------

    //--------------------------- GESTIONE ERRORI ------------------------------
    printValidationErrors:function(errors){
      let ret = '';
      if(errors){
        for(let i=0;i<errors.length;i++){
          ret += '<div class="row mt-2">'
            ret += '<div class="col-sm-8 offset-sm-2">'
              ret += '<div class="alert alert-danger">'+errors[i]+'</div>'
            ret += '</div>'
          ret += '</div>'
        }
      }

      return ret;
    },
    printSuccessMsg:function(success){
      let ret = '';

        for(let i=0;i<success.length;i++){
          ret += '<div class="row mt-2">'
            ret += '<div class="col-sm-8 offset-sm-2">'
              ret += '<div class="alert alert-success">'+success[i]+'</div>'
            ret += '</div>'
          ret += '</div>'
        }

      return ret;
    }
    //-------------------------------- END -------------------------------------
};
//----------------------------------- END --------------------------------------




//---------------------------- EXPORT DEL MODULO -------------------------------
module.exports = handlebarsHelpers;
//----------------------------------- END --------------------------------------
