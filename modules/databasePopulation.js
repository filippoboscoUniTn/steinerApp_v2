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
    let utenti = [];

    let admin = new Utenti({
        nome:'admin',
        cognome:'admin',
        email:'admin@gmail.com',
        username:'admin',
        password:'admin',
        authorization:'ADMIN',
        status:'ACCEPTED'

    });
    let utente_1 = new Utenti({
        nome:'utente_1',
        cognome:'utente_1',
        email:'utente_1@gmail.com',
        username:'utente_1',
        password:'utente_1',
        authorization:'TEACHER',
        status:'ACCEPTED'

    });
    let utente_2 = new Utenti({
        nome:'utente_2',
        cognome:'utente_2',
        email:'utente_2@gmail.com',
        username:'utente_2',
        password:'utente_2',
        authorization:'TEACHER',
        status:'ACCEPTED'

    });
    let utente_3 = new Utenti({
        nome:'utente_3',
        cognome:'utente_3',
        email:'utente_3@gmail.com',
        username:'utente_3',
        password:'utente_3',
        authorization:'TEACHER',
        status:'ACCEPTED'

    });

    utenti.push(admin);
    utenti.push(utente_1);
    utenti.push(utente_2);
    utenti.push(utente_3);

    for(let i=0;i<utenti.length;i++){
      utenti[i].insertUser(utenti[i],function (user,num) {

      })
    }

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

    for(let i = 0; i< 450 ; i++){
      let studente = new Studenti({
        nome: 'studente_' + String(i),
        cognome: 'studente_' + String(i),
        ammesso:true,
        luogoNascita:'Rovigo',
        dataNascita:new Date(1993,4,i%28),
        residenza:{
            comune:'Padova',
            cap:385422,
            indirizzo:{
                via:'Via ' + (i%6) + ' Febbraio',
                numeroCivico:(i%20),
            }
        }
      })
      studente.save()
    }

    // let std_1 = new Studenti({
    //     nome:'Davide',
    //     cognome:'Bazzanella',
    //     ammesso:true,
    //     luogoNascita:'Rovigo',
    //     dataNascita:new Date(1993,4,25),
    //     residenza:{
    //         comune:'Padova',
    //         cap:385422,
    //         indirizzo:{
    //             via:'Via G. Diaz',
    //             numeroCivico:16,
    //         }
    //     }
    // });
    // std_1.save();

};


//POPOLAZIONE CLASSI
module.exports.popClasse = function(){
  let anniScolastici = ['2017/18','2018/19','2019/20']
  let materie = ['Storia','Tedesco','Inglse','Geografia','Fisica','Euritmia','Scienze','Matematica','Educazione Fisica','Arte','Lavoro Manuale']
  let nClassi = 8;
  let nSezioni = 1;
  let classeSize = 10;
  Studenti.find({},{_id:0, id:1},function (err,results){
    if(err){
      throw err;
    }
    let idStudenti = []
    for(let t1=0;t1<results.length;t1++){
      if(idStudenti.indexOf(results[t1].id) === -1 ){
        idStudenti.push(results[t1].id)
      }
      else{
        console.log("Error, duplicate studente");
      }
    }

    //Creazione Anni
    for(let t2=0;t2<anniScolastici.length;t2++){
      let annoScolastico = anniScolastici[t2];
      console.log("anno = " + annoScolastico)
      //Creazione Classi
      for(let t3=0;t3<nClassi;t3++){
        let classe = (t3%8) +1;
        if(classe === 1 || classe === 8){
          nSezioni = 2;
        }
        //Creazione Sezioni
        for(let t4=0;t4<nSezioni;t4++){
          let sezione = String.fromCharCode(65 + t4)
          console.log(sezione);
          let randomMaterie = []
          //Creazione Materie
          for(let t5=0;t5<5;t5++){
              let min = 0
              let max = materie.length
              let randomIndex = Math.floor(Math.random() * (+max - +min)) + +min
              if(randomMaterie.indexOf(materie[randomIndex]) === -1){
                randomMaterie.push(materie[randomIndex]);
              }
              else{
                t5--;
              }
          }
          console.log(randomMaterie)
          //Estrazione Studenti
          let randomStudenti = []
          for(let t6=0;t6<classeSize;t6++){
            randomIndex = Math.floor(Math.random()*(+idStudenti.length - +0)) + +0
            randomStudenti.push(idStudenti[randomIndex]);
            idStudenti.splice(randomIndex,1);
          }
          console.log(randomStudenti)
          //Creazione Documento
          // let newClasse = new Classi({
          //   annoScolastico:annoScolastico,
          //   classe:classe,
          //   sezione:sezione,
          //   studenti:
          //   materie:
          //   maestroClasse:{
          //       nome:'Lucia',
          //       cognome:'Vergot'
          //   }
          // })
        }
        nSezioni = 1;
      }
    }
  })










      //
      //
      //
      //
      // let annoScolastico;
      // let classe = (i%8)+1;
      // let sezione = '';
      // let randomStudenti = []
      // let randomMaterie = [];
      //
      // if(i<10){
      //   console.log("i <10")
      //   annoScolastico='2017/18';
      //
      // }
      // else if(i<20){
      //   console.log("i <20")
      //
      //   annoScolastico='2018/19';
      // }
      // else{
      //   console.log("i <30")
      //
      //   annoScolastico='2019/20';
      // }
      //
      // if( (i%10)==0 || (i%10)== 1 ){
      //   sezione = 'B'
      // }
      // else{
      //   sezione = 'A'
      // }
      //
      // for(let j=0;j<5;j++){
      //     let min = 0
      //     let max = materie.length
      //     let randomIndex = Math.floor(Math.random() * (+max - +min)) + +min
      //     if(randomMaterie.indexOf(materie[randomIndex]) === -1){
      //       randomMaterie.push(materie[randomIndex]);
      //     }
      //     else{
      //       i--;
      //     }
      //
      // }
      //
      // for (var a=[],iq=0;iq<450;++iq) a[iq]=iq;
      // function shuffle(array) {
      //   var tmp, current, top = array.length;
      //   if(top) while(--top) {
      //     current = Math.floor(Math.random() * (top + 1));
      //     tmp = array[current];
      //     array[current] = array[top];
      //     array[top] = tmp;
      //   }
      //   return array;
      // }
      // a = shuffle(a);
      // for(let k=0;k<15;k++){
      //   randomStudenti.push(a.pop())
      // }
      //
      // let newClasse = new Classi({
      //
      //     annoScolastico:annoScolastico,
      //     classe: classe,
      //     sezione:sezione,
      //     materie:randomMaterie,
      //     maestroClasse:{
      //         nome:'Lucia',
      //         cognome:'Vergot'
      //     },
      //     studenti:randomStudenti
      // });
      // newClasse.save()
      //
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


module.exports.popPagelle = function (){

  let anniScolastici = ['2017/18','2018/19','2019/20']
  //itera anni scolastici
    //itera classi
    for(let j=0;j<30;j++){
      let as = ''
      if(j<10){
        as='2017/18';
      }
      else if(j<20){
        as='2018/19';
      }
      else{
        as='2019/20';
      }
      let classe = (j%8) +1
      let sezione
      if( (j%10)==0 || (j%10)==1 ) {
        sezione = 'B'

      }
      else{
        sezione = 'A'
      }
      Classi.find({annoScolastico:as,classe:classe,sezione:sezione},{annoScolastico:1,classe:1,sezione:1,studenti:1,materie:1},function (err,results){
        console.log("res = " + results[0])
        for(let y=0;y<results[0].studenti.length;y++){
          for(let g=0;g<results[0].materie.length;g++){
            let newPagella = new Pagelle({
              idStudente:results[0].studenti[y],
              materia:results[0].materie[g],
              classe:results[0].classe,
              sezione:results[0].sezione,
              annoScolastico:results[0].annoScolastico
            })
            newPagella.save()
          }
        }
      })
    }

}




module.exports.popPagelle2 = function () {
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
