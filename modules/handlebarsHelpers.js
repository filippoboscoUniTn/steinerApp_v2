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
    }
};

module.exports = handlebarsHelpers;