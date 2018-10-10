"use strict";
const dbPop = require('./databasePopulation');
const dbClean = require('./databaseCleanup');
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
require('no-config')({
    config: require('../config')
}).then(
    function(conf){
        let connection = mongoose.connect('mongodb://'+conf.mongoDB.host+'/'+conf.mongoDB.db,{
            useMongoClient:true,
        }).then(
            () => {
                console.log('successfull connection to MongoDB!\n@'+conf.mongoDB.host+'/'+conf.mongoDB.db);


                //Database cleanup
                  // dbClean.dropUtenti();
                  // dbClean.dropStudenti();
                  // dbClean.dropClassi();
                  //dbClean.dropAnniScolastici();
                  //dbClean.dropCounters();
                  //dbClean.dropPermessi();
                  //dbClean.dropPagelle();

                //Database population
                    // dbPop.popUtenti();
                    // dbPop.popAutoInc();
                    //
                    // dbPop.popAnniSc();
                    // dbPop.popStudente();
                    //
                    dbPop.popClasse();
                    // dbPop.popPagelle();

                    // dbPop.popPermessiUtente();

            },
            err => {
                console.log('error during connection to MongoDB');
                throw err
            });
        module.exports = connection
    }
)

// module.exports = function(callback){
//   require('no-config')({
//       config: require('../config')
//   }).then(
//       function(conf){
//           let connection = mongoose.connect('mongodb://'+conf.mongoDB.host+'/'+conf.mongoDB.db,{
//               useMongoClient:true,
//           }).then(
//               () => {
//                   console.log('successfull connection to MongoDB!\n@'+conf.mongoDB.host+'/'+conf.mongoDB.db)
//                   callback(null,connection)
//               },
//               err => {
//                   console.log('error during connection to MongoDB');
//                   callback(err,null)
//               });
//       }
//   )
// }
