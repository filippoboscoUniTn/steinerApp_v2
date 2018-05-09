"use strict";
const path = require('path');
const util = require('util');

//Modules
const compareModule = require('./comparisonFunctions');


let handlebarsHelpers = {
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
    }
};

module.exports = handlebarsHelpers;