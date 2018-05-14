"use strict";
const path = require('path');
const util = require('util');

//Modules
const compareModule = require('./comparisonFunctions');


let handlebarsHelpers = {
    //Helpers Area Utente
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
    //Helpers Area Amministratore
    printAnniGestione:function (anniScolastici){
        console.log("anni = " + util.inspect(anni))
        var ret= '<div class="row">';
        for(var i=0;i<anni.length;i++){
            if( (i+2)%2 ==0 ){
                ret+= '<div class="col-sm-12 col-md-5 gray">'
            }
            else{
                ret +='<div class="col-sm-12 col-md-5 col-md-offset-1 gray">'
            }
            ret+= '<a href="/admin/gestioneAnni/'+anni[i].nome+'"><h3>'+anni[i].nome+'</h3></a>'
            ret+= '<button type="button" class="btn btn-md btn-right4 btn-blue" onclick="openModalAnno(this,\''+anni[i].nome+'\')" ><span class="glyphicon glyphicon-cog blue"></span></button>'
            ret+= '<button class="btn btn-md btn-right5 btn-blue" onclick="openModalPDF(this,\''+anni[i].nome+'\')"><span class="glyphicon glyphicon-print blue"></span></button>'
            ret+= '</div> '
            if( (i+1)%3==0){
                ret+= '</div><div class="row">'
            }

        }

        if(anni.length == 0 || anni.length % 2 == 0){
            ret +='<div class="col-sm-12 col-md-5 gray">'
        }
        else{

            ret+='<div class="col-sm-12 col-md-5 col-md-offset-1 gray">'
        }
        ret+='<a href="/admin/gestioneAnni/nuovoAnno"><h3>Nuovo Anno</h3></a></div>'
        ret+='</div>'
        return ret;
    }
};

module.exports = handlebarsHelpers;