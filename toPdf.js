var express = require('express');
var pdfKit = require('pdfkit');

var Classi = require('../../models/classi');

var path = require('path');
var fs = require('fs');
const util = require('util')

var router = express.Router();




router.post('/:as(20[0-9][0-9]/[0-9][0-9]$)',function(req,res,next){

    var as = req.params.as
    var semestre = req.body.semestre
    var asDir = String.prototype.concat(as.split("/")[0],'-20',as.split("/")[1])

    var fontSz = req.body.fontSize
    console.log("in stampa pdf test, semestre = " + semestre + "\nfontSize = " + fontSz)

    Classi.getClassesByAs(as,function(err,results){
        //results = [{classe:1,sezione:A},{etc...}]
        var getSubjectsAndStudentsChain = [];
        for(var i=0;i<results.length;i++){
            var classe = results[i].classe
            var sezione = results[i].sezione
            console.log("classe = " + classe)
            console.log("sezione = " + sezione)
            var newPromise = new Promise(function(resolve,reject){
                Classi.getStudentsAndSubjects2(as,classe,sezione,function(err,studenti,materie,classe,sezione){
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve({classe:classe,
                            sezione:sezione,
                            studenti:studenti,
                            materie:materie})
                    }
                })
            })
            getSubjectsAndStudentsChain.push(newPromise)
        }
        Promise.all(getSubjectsAndStudentsChain).then(function(infoClassi){

            var newPdf = new pdfKit();
            newPdf.pipe(res);
            //foreach class&sez.
            for(var i=0;i<results.length;i++){
                //foreach student
                for(var j=0;j<infoClassi[i].studenti.length;j++){
                    if(i!=0 || j!=0){
                        newPdf.addPage();
                    }
                    if(semestre == 1){
                        console.log("in if")
                        newPdf.fontSize(15).text('Associazione Pedagogica Steineriana',{align:'center'});
                        newPdf.fontSize(15).text('Scuola Rudolf Steiner',{align:'center'})
                        newPdf.fontSize(7).moveDown(1).text('Paritaria comprensiva di scuola primaria e secondaria di primo grado',{align:'center'})
                        newPdf.fontSize(7).text('(determinazione del dirigente n. 41 del 31 marzo 2009)',{align:'center'})
                        newPdf.fontSize(10).moveDown(1).text('Via Conci, n.86 - 38123 TRENTO',{align:'center'})
                        newPdf.font('Helvetica-Bold').fontSize(10).text('Anno Scolastico ' + as,{align:'center'})
                        newPdf.font('Helvetica-Bold').fontSize(15).moveDown(1).text(semestre+'° Quadrimestre',{align:'center'});
                        newPdf.fontSize(10).font('Helvetica').moveDown(1).text("(Il presente documento, rilasciato in forma provvisoria, rispecchia fedelmente il contenuto dell'originale,",{align:'center'})
                        newPdf.fontSize(10).font('Helvetica').text("ha valore di semplice comunicazione, non integra né sostituisce la pagella ufficiale)",{align:'center'})
                        newPdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text('Classe ' + infoClassi[i].classe + ' SEZ. '+ infoClassi[i].sezione,{align:'center'})
                        newPdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text(infoClassi[i].studenti[j].nome + ' ' + infoClassi[i].studenti[j].cognome,{align:'center'})

                        //foreach subject
                        for(var k=0;k<infoClassi[i].materie.length;k++){

                            newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(infoClassi[i].materie[k]+' :',{align:'left'})
                            var studDir = infoClassi[i].studenti[j].nome + '_' + infoClassi[i].studenti[j].cognome + '_' + infoClassi[i].studenti[j].id
                            var fileName = semestre +'_semestre.txt';
                            var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                            var reportPath = path.join(__dirname,'..','..','data',fileAs,String(infoClassi[i].classe),infoClassi[i].sezione,studDir,infoClassi[i].materie[k],fileName);
                            var data;
                            try{
                                data = fs.readFileSync(reportPath)
                                newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})
                            }catch(err){
                                newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                            }
                        }
                    }
                    else{
                        console.log("in else")
                        let textColor = '#515151';
                        let gridColor = '#bec0be';
                        //Second page
                        newPdf.addPage()
                        newPdf.moveDown(4).font('Times-Bold').fontSize(12).fillColor(textColor).text('Federazione delle Scuole Steiner-Waldorf in Italia',{align:'center'})
                        newPdf.moveDown(0).font('Times-Bold').fontSize(10).fillColor(textColor).text('Sede legale: Via Rudolf Steiner, 2-4-6 31020 Zoppè di San Vendemmiano (TV)',{align:'center'})
                        //Third page
                        newPdf.addPage()

                        //Primo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
                        //Secondo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(infoClassi[i].studenti[j].nome + " " + infoClassi[i].studenti[j].cognome,245,100);
                        //Terzo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);
                        //Terzo Riquadro, seconda riga
                        newPdf.font('Times-Bold').fontSize(12).fillColor(textColor).text("I QUADRIMESTRE",410,135);
                        //Header centrale post riquadro
                        newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text("Relazione del Collegio di Classe",190,165);

                        //Riquadro
                        newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
                        newPdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(gridColor);
                        newPdf.moveTo(215,50).lineTo(215,150).stroke(gridColor);
                        newPdf.moveTo(380,50).lineTo(380,150).stroke(gridColor);
                        newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text(" ",50,210);
                        for(var k=0;k<infoClassi[i].materie.length;k++){
                            newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(infoClassi[i].materie[k]+' :',{align:'left'})
                            var studDir = infoClassi[i].studenti[j].nome + '_' + infoClassi[i].studenti[j].cognome + '_' + infoClassi[i].studenti[j].id
                            var fileName = semestre +'_semestre.txt';
                            var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                            var reportPath = path.join(__dirname,'..','..','data',fileAs,String(infoClassi[i].classe),infoClassi[i].sezione,studDir,infoClassi[i].materie[k],fileName);
                            var data;
                            try{
                                data = fs.readFileSync(reportPath)
                                newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})
                            }catch(err){
                                newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                            }
                        }
                        //Quarta pagina
                        newPdf.addPage()

                        //Primo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
                        //Secondo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(infoClassi[i].studenti[j].nome + " " + infoClassi[i].studenti[j].cognome,245,100);
                        //Terzo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);
                        //Terzo Riquadro, seconda riga
                        newPdf.font('Times-Bold').fontSize(12).fillColor(textColor).text("II QUADRIMESTRE",410,135);
                        //Header centrale post riquadro
                        newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text("Relazione del Collegio di Classe",190,165);

                        //Riquadro
                        newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
                        newPdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(gridColor);
                        newPdf.moveTo(215,50).lineTo(215,150).stroke(gridColor);
                        newPdf.moveTo(380,50).lineTo(380,150).stroke(gridColor);
                        newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text(" ",50,210);
                        for(var k=0;k<infoClassi[i].materie.length;k++){
                            newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(infoClassi[i].materie[k]+' :',{align:'left'})
                            var studDir = infoClassi[i].studenti[j].nome + '_' + infoClassi[i].studenti[j].cognome + '_' + infoClassi[i].studenti[j].id
                            var fileName = semestre +'_semestre.txt';
                            var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                            var reportPath = path.join(__dirname,'..','..','data',fileAs,String(infoClassi[i].classe),infoClassi[i].sezione,studDir,infoClassi[i].materie[k],fileName);
                            var data;
                            try{
                                data = fs.readFileSync(reportPath)
                                newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})
                            }catch(err){
                                newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                            }
                        }
                        //Quinta pagina
                        newPdf.addPage();
                        //Primo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
                        //Secondo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(infoClassi[i].studenti[j].nome + " " + infoClassi[i].studenti[j].cognome,245,100);
                        //Terzo Riquadro
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);

                        //Riquadro
                        newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
                        newPdf.moveTo(215,50).lineTo(215,125).stroke(gridColor);
                        newPdf.moveTo(380,50).lineTo(380,125).stroke(gridColor);

                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Validazione dell'anno scolastico",200,185);

                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Ai fini della validità dell'anno scolastico, l'alunno "+infoClassi[i].studenti[j].nome + " " + infoClassi[i].studenti[j].cognome + " ha frequentato le lezioni per almeno tre quarti dell'orario scolastico.",70,230);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("L'insegnante di classe",50,350);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("..........................................",50,380);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Firma di uno dei genitori o di chi ne fa le veci",50,450);
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("..........................................",50,480);

                        let dataOggi = new Date();
                        let mese ;
                        switch(dataOggi.getMonth()){
                            case 0 :
                                mese = 'Gennaio'
                                break;
                            case 1 :
                                mese = 'Febbraio'
                                break;
                            case 2 :
                                mese = 'Marzo'
                                break;
                            case 3 :
                                mese = 'Aprile'
                                break;
                            case 4 :
                                mese = 'Maggio'
                                break;
                            case 5 :
                                mese = 'Giugno'
                                break;
                            case 6 :
                                mese = 'Luglio'
                                break;
                            case 7 :
                                mese = 'Agosto'
                                break;
                            case 8 :
                                mese = 'Settembre'
                                break;
                            case 9 :
                                mese = 'Ottobre'
                                break;
                            case 10 :
                                mese = 'Novembre'
                                break;
                            case 11 :
                                mese = 'Dicembre'
                                break;

                        }
                        newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),50,560);
                        newPdf.moveTo(50,175).lineTo(545,175).lineTo(545,300).lineTo(50,300).lineTo(50,175).stroke(gridColor);

                        //Sesta pagina
                        newPdf.addPage();
                        newPdf.font('Times-Roman').fontSize(20).fillColor(textColor).text("Attestato",{align:'center'});
                        newPdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(textColor).text("Vista la valutazione del Collegio di Classe in sede di scrutinio finale, si attesta che l'alunno/a "+infoClassi[i].studenti[j].nome + " " + infoClassi[i].studenti[j].cognome + " è ammesso/a alla classe successiva",{align:'center'});
                        newPdf.moveDown(4).font('Times-Roman').fontSize(16).fillColor(textColor).text("Il Coordinatore Didattico (prof. Carlo Musio)",{align:'left'});
                        //newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("(prof. Carlo Musio)",{align:'left'});
                        newPdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),{align:'left'});

                        //Testo riquadro pie pagina
                        newPdf.font('Times-Roman').fontSize(14).fillColor(textColor).text("Associazione Pedagogica Steineriana",200,610);
                        newPdf.font('Times-Roman').fontSize(22).fillColor(textColor).text("SCUOLA RUDOLF STEINER",175,635);
                        newPdf.font('Times-Roman').fontSize(8).fillColor(textColor).text("PARITARIA COMPRENSIVA DI SCUOLA PRIMARIA E SECONDARIA DI PRIMO GRADO",150,660);
                        newPdf.font('Times-Roman').fontSize(8).fillColor(textColor).text("(DETERMINAZIONE DEL DIRIGENTE N. 41 DEL 31 MARZO 2009",200,670);
                        newPdf.font('Times-Roman').fontSize(14).fillColor(textColor).text("Via Conci, n. 86 - 38123 TRENTO",200,680);



                        //Riquadro a pie pagina
                        newPdf.moveTo(50,600).lineTo(545,600).lineTo(545,700).lineTo(50,700).lineTo(50,600).stroke(gridColor);

                        //Pagina vuola alla fine
                        newPdf.addPage();
                    }
                }
            }
            newPdf.end();
        },err=>{
            next(err)
        })
    })
})



router.post('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:nome/:cognome/:matricola',function(req,res,next){
    var as = req.params.as;
    var classe = req.params.classe;
    var nome = req.params.nome;
    var cognome = req.params.cognome;
    var sezione = req.params.sezione;
    var matricola = req.params.matricola
    var fontSz = req.body.fontSize
    var semestre = req.body.semestre;

    if(semestre == 1){
        Classi.getSubjects(as,classe,sezione,function(err,materie){
            if(err){
                next(err)
            }
            var newPdf = new pdfKit();
            newPdf.fontSize(15).text('Associazione Pedagogica Steineriana',{align:'center'});
            newPdf.fontSize(15).text('Scuola Rudolf Steiner',{align:'center'})
            newPdf.fontSize(7).moveDown(1).text('Paritaria comprensiva di scuola primaria e secondaria di primo grado',{align:'center'})
            newPdf.fontSize(7).text('(determinazione del dirigente n. 41 del 31 marzo 2009)',{align:'center'})
            newPdf.fontSize(10).moveDown(1).text('Via Conci, n.86 - 38123 TRENTO',{align:'center'})
            newPdf.font('Helvetica-Bold').fontSize(10).text('Anno Scolastico ' + as,{align:'center'})
            newPdf.font('Helvetica-Bold').fontSize(15).moveDown(1).text(semestre+'° Quadrimestre',{align:'center'});
            newPdf.fontSize(10).font('Helvetica').moveDown(1).text("(Il presente documento, rilasciato in forma provvisoria, rispecchia fedelmente il contenuto dell'originale,",{align:'center'})
            newPdf.fontSize(10).font('Helvetica').text("ha valore di semplice comunicazione, non integra né sostituisce la pagella ufficiale)",{align:'center'})
            newPdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text('Classe ' + classe + ' SEZ. '+ sezione,{align:'center'})
            newPdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text(nome + ' ' + cognome,{align:'center'})
            for(var j=0;j<materie.length;j++){
                newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(materie[j]+' :',{align:'left'})
                var studDir = nome + '_' + cognome + '_' +matricola
                var fileName = semestre +'_semestre.txt';
                var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                var reportPath = path.join(__dirname,'..','..','data',fileAs,classe,sezione,studDir,materie[j],fileName);
                console.log("reportPath = " + reportPath)
                var data;
                try{
                    data = fs.readFileSync(reportPath)
                    newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})

                }catch(err){
                    newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                }
            }
            newPdf.pipe(res);
            newPdf.end();
        })
    }



    else{
        Classi.getSubjects(as,classe,sezione,function(err,materie){
            if(err){
                next(err)
            }
            var newPdf = new pdfKit();
            let textColor = '#515151';
            let gridColor = '#bec0be';
            //Second page
            newPdf.addPage()
            newPdf.moveDown(4).font('Times-Bold').fontSize(12).fillColor(textColor).text('Federazione delle Scuole Steiner-Waldorf in Italia',{align:'center'})
            newPdf.moveDown(0).font('Times-Bold').fontSize(10).fillColor(textColor).text('Sede legale: Via Rudolf Steiner, 2-4-6 31020 Zoppè di San Vendemmiano (TV)',{align:'center'})
            //Third page
            newPdf.addPage()

            //Primo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
            //Secondo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(nome + " " + cognome,245,100);
            //Terzo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);
            //Terzo Riquadro, seconda riga
            newPdf.font('Times-Bold').fontSize(12).fillColor(textColor).text("I QUADRIMESTRE",410,135);
            //Header centrale post riquadro
            newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text("Relazione del Collegio di Classe",190,165);

            //Riquadro
            newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
            newPdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(gridColor);
            newPdf.moveTo(215,50).lineTo(215,150).stroke(gridColor);
            newPdf.moveTo(380,50).lineTo(380,150).stroke(gridColor);
            newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text(" ",50,210);
            for(var j=0;j<materie.length;j++){
                newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(materie[j]+' :',{align:'left'})
                var studDir = nome + '_' + cognome + '_' + matricola
                var fileName = 1 +'_semestre.txt';
                var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                var reportPath = path.join(__dirname,'..','..','data',fileAs,classe,sezione,studDir,materie[j],fileName);
                console.log("reportPath in else = " + reportPath)
                var data;
                try{
                    data = fs.readFileSync(reportPath)
                    newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})

                }catch(err){
                    newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                }
            }
            //Quarta pagina
            newPdf.addPage()

            //Primo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
            //Secondo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(nome + " " + cognome,245,100);
            //Terzo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);
            //Terzo Riquadro, seconda riga
            newPdf.font('Times-Bold').fontSize(12).fillColor(textColor).text("II QUADRIMESTRE",410,135);
            //Header centrale post riquadro
            newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text("Relazione del Collegio di Classe",190,165);

            //Riquadro
            newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
            newPdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(gridColor);
            newPdf.moveTo(215,50).lineTo(215,150).stroke(gridColor);
            newPdf.moveTo(380,50).lineTo(380,150).stroke(gridColor);
            newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text(" ",50,210);
            for(var j=0;j<materie.length;j++){
                newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(materie[j]+' :',{align:'left'})
                var studDir = nome + '_' + cognome + '_' + matricola
                var fileName = 2 +'_semestre.txt';
                var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                var reportPath = path.join(__dirname,'..','..','data',fileAs,classe,sezione,studDir,materie[j],fileName);
                console.log("reportPath in else = " + reportPath)
                var data;
                try{
                    data = fs.readFileSync(reportPath)
                    newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})

                }catch(err){
                    newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                }
            }
            //Quinta pagina
            newPdf.addPage();
            //Primo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
            //Secondo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(nome + " " + cognome,245,100);
            //Terzo Riquadro
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);

            //Riquadro
            newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
            newPdf.moveTo(215,50).lineTo(215,125).stroke(gridColor);
            newPdf.moveTo(380,50).lineTo(380,125).stroke(gridColor);

            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Validazione dell'anno scolastico",200,185);

            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Ai fini della validità dell'anno scolastico, l'alunno "+nome + " " + cognome + " ha frequentato le lezioni per almeno tre quarti dell'orario scolastico.",70,230);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("L'insegnante di classe",50,350);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("..........................................",50,380);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Firma di uno dei genitori o di chi ne fa le veci",50,450);
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("..........................................",50,480);

            let dataOggi = new Date();
            let mese ;
            switch(dataOggi.getMonth()){
                case 0 :
                    mese = 'Gennaio'
                    break;
                case 1 :
                    mese = 'Febbraio'
                    break;
                case 2 :
                    mese = 'Marzo'
                    break;
                case 3 :
                    mese = 'Aprile'
                    break;
                case 4 :
                    mese = 'Maggio'
                    break;
                case 5 :
                    mese = 'Giugno'
                    break;
                case 6 :
                    mese = 'Luglio'
                    break;
                case 7 :
                    mese = 'Agosto'
                    break;
                case 8 :
                    mese = 'Settembre'
                    break;
                case 9 :
                    mese = 'Ottobre'
                    break;
                case 10 :
                    mese = 'Novembre'
                    break;
                case 11 :
                    mese = 'Dicembre'
                    break;

            }
            newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),50,560);
            newPdf.moveTo(50,175).lineTo(545,175).lineTo(545,300).lineTo(50,300).lineTo(50,175).stroke(gridColor);

            //Sesta pagina
            newPdf.addPage();
            newPdf.font('Times-Roman').fontSize(20).fillColor(textColor).text("Attestato",{align:'center'});
            newPdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(textColor).text("Vista la valutazione del Collegio di Classe in sede di scrutinio finale, si attesta che l'alunno/a "+nome + " " + cognome + " è ammesso/a alla classe successiva",{align:'center'});
            newPdf.moveDown(4).font('Times-Roman').fontSize(16).fillColor(textColor).text("Il Coordinatore Didattico (prof. Carlo Musio)",{align:'left'});
            //newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("(prof. Carlo Musio)",{align:'left'});
            newPdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),{align:'left'});

            //Testo riquadro pie pagina
            newPdf.font('Times-Roman').fontSize(14).fillColor(textColor).text("Associazione Pedagogica Steineriana",200,610);
            newPdf.font('Times-Roman').fontSize(22).fillColor(textColor).text("SCUOLA RUDOLF STEINER",175,635);
            newPdf.font('Times-Roman').fontSize(8).fillColor(textColor).text("PARITARIA COMPRENSIVA DI SCUOLA PRIMARIA E SECONDARIA DI PRIMO GRADO",150,660);
            newPdf.font('Times-Roman').fontSize(8).fillColor(textColor).text("(DETERMINAZIONE DEL DIRIGENTE N. 41 DEL 31 MARZO 2009",200,670);
            newPdf.font('Times-Roman').fontSize(14).fillColor(textColor).text("Via Conci, n. 86 - 38123 TRENTO",200,680);



            //Riquadro a pie pagina
            newPdf.moveTo(50,600).lineTo(545,600).lineTo(545,700).lineTo(50,700).lineTo(50,600).stroke(gridColor);

            //Pagina vuola alla fine
            newPdf.addPage();
            newPdf.pipe(res);
            newPdf.end();
        })
    }

})


router.post('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',function(req,res,next){

	var as = req.params.as;
	var asDir = String.prototype.concat(as.split("/")[0],'-20',as.split("/")[1])
	var classe = Number(req.params.classe)
	var sezione = req.params.sezione;
	var semestre = req.body.semestre;
	var fontSz = req.body.fontSize;

	Classi.getStudentsAndSubjects(as,classe,sezione,function(err,studenti,materie){
		if(err){
			next(err);
		}
		var newPdf = new pdfKit();
		for(var i=0;i<studenti.length;i++){
			if(i!=0){
				newPdf.addPage();
			}
			if(semestre == 1){
                newPdf.fontSize(15).text('Associazione Pedagogica Steineriana',{align:'center'});
                newPdf.fontSize(15).text('Scuola Rudolf Steiner',{align:'center'})
                newPdf.fontSize(7).moveDown(1).text('Paritaria comprensiva di scuola primaria e secondaria di primo grado',{align:'center'})
                newPdf.fontSize(7).text('(determinazione del dirigente n. 41 del 31 marzo 2009)',{align:'center'})
                newPdf.fontSize(10).moveDown(1).text('Via Conci, n.86 - 38123 TRENTO',{align:'center'})
                newPdf.font('Helvetica-Bold').fontSize(10).text('Anno Scolastico ' + as,{align:'center'})
                newPdf.font('Helvetica-Bold').fontSize(15).moveDown(1).text(semestre+'° Quadrimestre',{align:'center'});
                newPdf.fontSize(10).font('Helvetica').moveDown(1).text("(Il presente documento, rilasciato in forma provvisoria, rispecchia fedelmente il contenuto dell'originale,",{align:'center'})
                newPdf.fontSize(10).font('Helvetica').text("ha valore di semplice comunicazione, non integra né sostituisce la pagella ufficiale)",{align:'center'})
                newPdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text('Classe ' + classe + ' SEZ. '+ sezione,{align:'center'})
                newPdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text(studenti[i].nome + ' ' + studenti[i].cognome,{align:'center'})

                for(var j=0;j<materie.length;j++){

                    newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(materie[j]+' :',{align:'left'})
                    var studDir = studenti[i].nome + '_' + studenti[i].cognome + '_' + studenti[i].id
                    var fileName = semestre +'_semestre.txt';
                    var fileAs = asDir;
                    var reportPath = path.join(__dirname,'..','..','data',fileAs,String(classe),sezione,studDir,materie[j],fileName);
                    var data;
                    try{

                        data = fs.readFileSync(reportPath)
                        newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})

                    }catch(err){
                        newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                    }

                }
            }
            else{
                let textColor = '#515151';
                let gridColor = '#bec0be';
                //Second page
                newPdf.addPage()
                newPdf.moveDown(4).font('Times-Bold').fontSize(12).fillColor(textColor).text('Federazione delle Scuole Steiner-Waldorf in Italia',{align:'center'})
                newPdf.moveDown(0).font('Times-Bold').fontSize(10).fillColor(textColor).text('Sede legale: Via Rudolf Steiner, 2-4-6 31020 Zoppè di San Vendemmiano (TV)',{align:'center'})
                //Third page
                newPdf.addPage()

                //Primo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
                //Secondo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(studenti[i].nome + " " + studenti[i].cognome,245,100);
                //Terzo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);
                //Terzo Riquadro, seconda riga
                newPdf.font('Times-Bold').fontSize(12).fillColor(textColor).text("I QUADRIMESTRE",410,135);
                //Header centrale post riquadro
                newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text("Relazione del Collegio di Classe",190,165);

                //Riquadro
                newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
                newPdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(gridColor);
                newPdf.moveTo(215,50).lineTo(215,150).stroke(gridColor);
                newPdf.moveTo(380,50).lineTo(380,150).stroke(gridColor);
                newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text(" ",50,210);
                for(var j=0;j<materie.length;j++){
                    newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(materie[j]+' :',{align:'left'})
                    var studDir = studenti[i].nome + '_' + studenti[i].cognome + '_' + studenti[i].id
                    var fileName = 1 +'_semestre.txt';
                    var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                    var reportPath = path.join(__dirname,'..','..','data',fileAs,String(classe),sezione,studDir,materie[j],fileName);
                    console.log("reportPath in else = " + reportPath)
                    var data;
                    try{
                        data = fs.readFileSync(reportPath)
                        newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})

                    }catch(err){
                        newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                    }
                }
                //Quarta pagina
                newPdf.addPage()

                //Primo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
                //Secondo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(studenti[i].nome + " " + studenti[i].cognome,245,100);
                //Terzo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);
                //Terzo Riquadro, seconda riga
                newPdf.font('Times-Bold').fontSize(12).fillColor(textColor).text("II QUADRIMESTRE",410,135);
                //Header centrale post riquadro
                newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text("Relazione del Collegio di Classe",190,165);

                //Riquadro
                newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
                newPdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(gridColor);
                newPdf.moveTo(215,50).lineTo(215,150).stroke(gridColor);
                newPdf.moveTo(380,50).lineTo(380,150).stroke(gridColor);
                newPdf.font('Times-Bold').fontSize(16).fillColor(textColor).text(" ",50,210);
                for(var j=0;j<materie.length;j++){
                    newPdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(materie[j]+' :',{align:'left'})
                    var studDir = studenti[i].nome + '_' + studenti[i].cognome + '_' + studenti[i].id
                    var fileName = 2 +'_semestre.txt';
                    var fileAs = String.prototype.concat(as.split("/")[0],'-','20',as.split("/")[1]);
                    var reportPath = path.join(__dirname,'..','..','data',fileAs,String(classe),sezione,studDir,materie[j],fileName);
                    console.log("reportPath in else = " + reportPath)
                    var data;
                    try{
                        data = fs.readFileSync(reportPath)
                        newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(data,{align:'left'})

                    }catch(err){
                        newPdf.moveDown(1).font('Helvetica').fontSize(fontSz).text(' ',{align:'left'})
                    }
                }
                //Quinta pagina
                newPdf.addPage();
                //Primo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Scuola Rudolf Steiner",60,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento",110,100);
                //Secondo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Alunno/a",265,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(studenti[i].nome + " " + studenti[i].cognome,245,100);
                //Terzo Riquadro
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Anno Scolastico",410,75);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text(as,430,100);

                //Riquadro
                newPdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(gridColor);
                newPdf.moveTo(215,50).lineTo(215,125).stroke(gridColor);
                newPdf.moveTo(380,50).lineTo(380,125).stroke(gridColor);

                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Validazione dell'anno scolastico",200,185);

                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Ai fini della validità dell'anno scolastico, l'alunno "+studenti[i].nome + " " + studenti[i].cognome + " ha frequentato le lezioni per almeno tre quarti dell'orario scolastico.",70,230);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("L'insegnante di classe",50,350);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("..........................................",50,380);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Firma di uno dei genitori o di chi ne fa le veci",50,450);
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("..........................................",50,480);

                let dataOggi = new Date();
                let mese ;
                switch(dataOggi.getMonth()){
                    case 0 :
                        mese = 'Gennaio'
                        break;
                    case 1 :
                        mese = 'Febbraio'
                        break;
                    case 2 :
                        mese = 'Marzo'
                        break;
                    case 3 :
                        mese = 'Aprile'
                        break;
                    case 4 :
                        mese = 'Maggio'
                        break;
                    case 5 :
                        mese = 'Giugno'
                        break;
                    case 6 :
                        mese = 'Luglio'
                        break;
                    case 7 :
                        mese = 'Agosto'
                        break;
                    case 8 :
                        mese = 'Settembre'
                        break;
                    case 9 :
                        mese = 'Ottobre'
                        break;
                    case 10 :
                        mese = 'Novembre'
                        break;
                    case 11 :
                        mese = 'Dicembre'
                        break;

                }
                newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),50,560);
                newPdf.moveTo(50,175).lineTo(545,175).lineTo(545,300).lineTo(50,300).lineTo(50,175).stroke(gridColor);

                //Sesta pagina
                newPdf.addPage();
                newPdf.font('Times-Roman').fontSize(20).fillColor(textColor).text("Attestato",{align:'center'});
                newPdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(textColor).text("Vista la valutazione del Collegio di Classe in sede di scrutinio finale, si attesta che l'alunno/a "+studenti[i].nome + " " + studenti[i].cognome + " è ammesso/a alla classe successiva",{align:'center'});
                newPdf.moveDown(4).font('Times-Roman').fontSize(16).fillColor(textColor).text("Il Coordinatore Didattico (prof. Carlo Musio)",{align:'left'});
                //newPdf.font('Times-Roman').fontSize(16).fillColor(textColor).text("(prof. Carlo Musio)",{align:'left'});
                newPdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),{align:'left'});

                //Testo riquadro pie pagina
                newPdf.font('Times-Roman').fontSize(14).fillColor(textColor).text("Associazione Pedagogica Steineriana",200,610);
                newPdf.font('Times-Roman').fontSize(22).fillColor(textColor).text("SCUOLA RUDOLF STEINER",175,635);
                newPdf.font('Times-Roman').fontSize(8).fillColor(textColor).text("PARITARIA COMPRENSIVA DI SCUOLA PRIMARIA E SECONDARIA DI PRIMO GRADO",150,660);
                newPdf.font('Times-Roman').fontSize(8).fillColor(textColor).text("(DETERMINAZIONE DEL DIRIGENTE N. 41 DEL 31 MARZO 2009",200,670);
                newPdf.font('Times-Roman').fontSize(14).fillColor(textColor).text("Via Conci, n. 86 - 38123 TRENTO",200,680);



                //Riquadro a pie pagina
                newPdf.moveTo(50,600).lineTo(545,600).lineTo(545,700).lineTo(50,700).lineTo(50,600).stroke(gridColor);

                //Pagina vuola alla fine
                newPdf.addPage();
            }

		}
		newPdf.pipe(res);
		newPdf.end();
	})

})

module.exports = router;