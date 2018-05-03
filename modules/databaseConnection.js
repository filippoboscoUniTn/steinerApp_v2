"use strict";
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('no-config')({
    config: require('../config')
}).then(
    function(conf){
        let connection = mongoose.connect('mongodb://'+conf.mongoDB.host+'/'+conf.mongoDB.db,{
            useMongoClient:true,
        }).then(
            () => {
                console.log('successfull connection to MongoDB!\n@'+conf.mongoDB.host+'/'+conf.mongoDB.db)
            },
            err => {
                console.log('error during connection to MongoDB');
                throw err
            });
        module.exports = connection
    }
)

