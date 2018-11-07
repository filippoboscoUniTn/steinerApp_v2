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
                let params = process.argv.slice(2,process.argv.length)
                params.forEach(function(val,index,array){
                  switch (val) {
                    case "-c":
                      console.log("-c catched")
                      dbClean.cleanDb().then(()=>{console.log("database clean")})
                                       .catch(err=>{console.log(err)})
                      break;
                    case "-p":
                      console.log("-p catched")
                      dbPop.popDb().then(()=>{console.log("database popolato")})
                                   .catch((err)=>{console.log("err")})
                      break;
                  }
                })
            },
            err => {
                console.log('error during connection to MongoDB');
                throw err
            });
        module.exports = connection
    }
)
.catch(err=>console.log("err"))
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
    //dbPop.popClasse();
    // dbPop.popPagelle();

    // dbPop.popPermessiUtente();
