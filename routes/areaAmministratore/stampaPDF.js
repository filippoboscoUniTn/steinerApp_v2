const express = require('express');
const pdfKit = require('pdfkit');
const util = require('util');
const AnniScolastici = require('../../models/anniScolastici')
const Classi = require('../../models/classi')
const Pagelle = require('../../models/pagelle')
const Studenti = require('../../models/studenti')

let router = express.Router();

let addHeader = (pdf,info)=>{

  pdf.fontSize(15).text('Associazione Pedagogica Steineriana',{align:'center'});
  pdf.fontSize(15).text('Scuola Rudolf Steiner',{align:'center'})
  pdf.fontSize(7).moveDown(1).text('Paritaria comprensiva di scuola primaria e secondaria di primo grado',{align:'center'})
  pdf.fontSize(7).text('(determinazione del dirigente n. 41 del 31 marzo 2009)',{align:'center'})
  pdf.fontSize(10).moveDown(1).text('Via Conci, n.86 - 38123 TRENTO',{align:'center'})
  pdf.font('Helvetica-Bold').fontSize(10).text('Anno Scolastico ' + info.annoScolastico,{align:'center'})
  pdf.font('Helvetica-Bold').fontSize(15).moveDown(1).text(info.semestre+'° Quadrimestre',{align:'center'});
  pdf.fontSize(10).font('Helvetica').moveDown(1).text("(Il presente documento, rilasciato in forma provvisoria, rispecchia fedelmente il contenuto dell'originale,",{align:'center'})
  pdf.fontSize(10).font('Helvetica').text("ha valore di semplice comunicazione, non integra né sostituisce la pagella ufficiale)",{align:'center'})

}

let addPagella = (pdf,pagella,semestre,fontSize)=>{
  let data = pagella.primoSemestre;
  if(semestre === 2){
    data = pagella.secondoSemestre;
  }
  pdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(pagella.materia+' :',{align:'left'})
  pdf.moveDown(1).font('Helvetica').fontSize(fontSize).text(data,{align:'left'})
}

router.post('/stampaStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:id',async function (req,res,next){

  const materie = Classi.getMaterieSezione(req.params.as,req.params.classe,req.params.sezione);
  const infoStudente = Studenti.getInfoStudente(req.params.id);

  let info = {
    annoScolastico: req.params.as,
    classe : req.params.classe,
    sezione: req.params.sezione,
    semestre: req.body.semestre,
    materie: await materie,
    studente: await infoStudente,
    fontSize: req.body.fontSize
  }
  let newPDF = new pdfKit();
  addHeader(newPDF,info);
  pdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text('Classe ' + info.classe + ' SEZ. '+ info.sezione,{align:'center'})
  pdf.moveDown(1).fontSize(10).font('Helvetica-Bold').text(info.studente.nome + ' ' + info.studente.cognome,{align:'center'})

  let pagelleMateriePromises = info.materie.map(async m=>Pagelle.getPagellaFromStudente(info.annoScolastico,info.classe,info.sezione,m,info.studente.id))
  const pagelleMaterie = await Promise.all(pagelleMateriePromises)
  pagelleMaterie.map(p=>addPagella(newPDF,p,info.semestre,info.fontSize,));

  newPDF.pipe(res);
  newPDF.end();
});


router.post('/stampaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',async function (req,res,next){
  console.log("hi")
  const idStudentiPromise = Classi.getStudentiFromAnnoScolasticoAndClasseAndSezione(req.params.as,req.params.classe,req.params.sezione)
  const materiePromise = Classi.getMaterieSezione(req.params.as,req.params.classe,req.params.sezione)
  const infoStudentiPromise = Promise.all(  Studenti.getInfoStudentiById(await idStudentiPromise) )


  let info = {
    annoScolastico: req.params.as,
    classe: req.params.classe,
    sezione: req.params.sezione,
    semestre: req.body.semestre,
    materie: await materiePromise,
    studenti: await infoStudentiPromise,
    fontSize: req.body.fontSize,
  }
  //console.log("info : " + util.inspect(info));
  //console.log("info.studenti = " + info.studenti)
  let newPDF = new pdfKit();
  console.log("util.inspect(info.studenti) =\n\n" + util.inspect(info.studenti) + "\n\n")
  for(const i in info.studenti){
    if(i!=0){newPDF.addPage()}
    addHeader(newPDF,info);
    newPDF.moveDown(1).fontSize(10).font('Helvetica-Bold').text('Classe ' + info.classe + ' SEZ. '+ info.sezione,{align:'center'})
    newPDF.moveDown(1).fontSize(10).font('Helvetica-Bold').text(info.studenti[i].nome + ' ' + info.studenti[i].cognome,{align:'center'})
    const pagelleMateriePromises = info.materie.map(async m=>Pagelle.getPagellaFromStudente(info.annoScolastico,info.classe,info.sezione,m,info.studenti[i].id))
    const pagelleMaterie = await Promise.all(pagelleMateriePromises)
    pagelleMaterie.map(p=>addPagella(newPDF,p,info.semestre,info.fontSize));
  }
  newPDF.pipe(res);
  newPDF.end();
});


router.post('/stampaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',function (req,res,next){

});


router.post('/stampaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function (req,res,next){

});



module.exports = router;
