"use strict";
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dbConnection = require('../modules/databaseConnection')

let counterSchema = new Schema({
    _id:{
        type: String,
        require:true
    },
    seq:{
        type: Number,
        default:0
    }
},{collection:'Counters'})


let Counter = mongoose.model('Counter',counterSchema);

module.exports = Counter;

module.exports.getNextValue = function(counterName,increment,callback){
    if(increment){
        Counter.findAndUpdate({_id:counterName},{ $inc:{ seq:1 } },function(err,counter){
            if(err){
                callback(err,null)
            }
            callback(null,counter.seq)
        })
    }
    else{
        Counter.find({_id:counterName},function(err,counter){
            if(err){
                callback(err,null)
            }
            else{
                callback(null,counter[0].seq)
            }
        })
    }
};
