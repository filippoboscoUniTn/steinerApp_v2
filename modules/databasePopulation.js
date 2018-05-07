const Utenti = require('../models/utenti');
const AnniScolastici = require('../models/anniScolastici');
const Classi = require('../models/classi');
const Pagelle = require('../models/pagelle');
const Studenti = require('../models/studenti');
const AutoIncrement = require('../models/autoIncrement');
const PermessiUtente = require('../models/permessiUtente');

const bCrypt = require("bcryptjs");

//POPOLAZIONE UTENTI
module.exports.popUtenti = function(){

    let utente_1 = new Utenti({
        nome:'utente_1',
        cognome:'utente_1',
        email:'utente_1@gmail.com',
        username:'utente_1',
        password:'utente_1',
        authorization:'TEACHER',
        status:'ACCEPTED'

    });

    utente_1.insertUser(utente_1,function (err,user,num){
        if(err){
            throw err
        }
        else{
            console.log("user = " + user)
        }
    })
};


//POPOLAZIONE ANNI SCOLASTICI
module.exports.popAnniSc = function(){
    let annoScolastico_1 = new AnniScolastici({
        nome:'2017/18'
    });
    annoScolastico_1.save();

    let annoScolastico_2 = new AnniScolastici({
        nome:'2018/19'
    });
    annoScolastico_2.save();

    let annoScolastico_3 = new AnniScolastici({
        nome:'2019/20'
    });
    annoScolastico_3.save();
};


//POPOLAZIONE AUTOiNCREMENT
module.exports.popAutoInc = function(){
    let newCounter = new AutoIncrement({
        _id:'studentCounter',
        seq:0
    });
    newCounter.save();
};


//POPOLAZIONE STUDENTI
module.exports.popStudente = function() {

    let std_1 = new Studenti({
        nome:'Davide',
        cognome:'Bazzanella',
        ammesso:true,
        luogoNascita:'Rovigo',
        dataNascita:new Date(1993,4,25),
        residenza:{
            comune:'Padova',
            cap:385422,
            indirizzo:{
                via:'Via G. Diaz',
                numeroCivico:16,
            }
        }
    });
    std_1.save();

};


//POPOLAZIONE CLASSI
module.exports.popClasse = function(){

    let classe_1 = new Classi({
        annoScolastico:'2017/18',
        classe:1,
        sezione:'B',
        materie:['Storia','Italiano','Inglese'],
        maestroClasse:{
            nome:'Lucia',
            cognome:'Vergot'
        },
        studenti:[0,1],
    });

    classe_1.save();
};

module.exports.popPermessiUtente = function () {
    let permesso_1 = new PermessiUtente({
        nome:'utente_1',
        cognome:'utente_1',
        annoScolastico:'2017/18',
        permessi:[{
            classi:[1,2,3],
            materia:'Tedesco'
        },{
            classi:[1,2,3],
            materia:'Inglese'
        }]
    });
    permesso_1.save()
};

module.exports.popPagelle = function () {
    let pagella_1 = new Pagelle({
        idStudente:0,
        materia:'Tedesco',
        classe:1,
        sezione:'A',
        annoScolastico:'2017/18',
        primoSemestre:'Lo studente è bravo ma non si applica molto!',
        secondoSemestre:'Lo studente ha cominciato ad applicarsi ma è un po\' tardi...'
    })
    let pagella_2 = new Pagelle({
        idStudente:0,
        materia:'Geografia',
        classe:1,
        sezione:'A',
        annoScolastico:'2017/18',
        primoSemestre:'Lo studente è bravo ma non si applica molto!',
        secondoSemestre:'Lo studente ha cominciato ad applicarsi ma è un po\' tardi...'
    })
    let pagella_3 = new Pagelle({
        idStudente:0,
        materia:'Inglese',
        classe:1,
        sezione:'A',
        annoScolastico:'2017/18',
        primoSemestre:'Lo studente è bravo ma non si applica molto!',
        secondoSemestre:'Lo studente ha cominciato ad applicarsi ma è un po\' tardi...'
    })
    let pagella_4 = new Pagelle({
        idStudente:1,
        materia:'Tedesco',
        classe:1,
        sezione:'A',
        annoScolastico:'2017/18',
        primoSemestre:'Lo studente è bravo ma non si applica molto!',
        secondoSemestre:'Lo studente ha cominciato ad applicarsi ma è un po\' tardi...'
    })
    let pagella_5 = new Pagelle({
        idStudente:1,
        materia:'Geografia',
        classe:1,
        sezione:'A',
        annoScolastico:'2017/18',
        primoSemestre:'Lo studente è bravo ma non si applica molto!',
        secondoSemestre:'Lo studente ha cominciato ad applicarsi ma è un po\' tardi...'
    })
    let pagella_6 = new Pagelle({
        idStudente:1,
        materia:'Inglese',
        classe:1,
        sezione:'A',
        annoScolastico:'2017/18',
        primoSemestre:'Lo studente è bravo ma non si applica molto!',
        secondoSemestre:'Lo studente ha cominciato ad applicarsi ma è un po\' tardi...'
    })
    pagella_1.save();
    pagella_2.save();
    pagella_3.save();
    pagella_4.save();
    pagella_5.save();
    pagella_6.save();

};