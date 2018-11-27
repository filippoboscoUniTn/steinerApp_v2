const express = require('express');
const pdfKit = require('pdfkit');
const util = require('util');
const AnniScolastici = require('../../models/anniScolastici')
const Classi = require('../../models/classi')
const Pagelle = require('../../models/pagelle')
const Studenti = require('../../models/studenti')

let router = express.Router();

let addHeader = (pdf,studente,classe,options)=>{
  //First Page
  pdf.addPage()
  pdf.moveDown(6).font('Times-Roman').fontSize(30).fillColor(options.textColor).text('Documenti di Valutazione',{align:'center'})
  pdf.moveDown(2).font('Times-Roman').fontSize(18).fillColor(options.textColor).text('Alunno/a         ' + studente.nome + ' ' + studente.cognome,{align:'left'})
  pdf.moveDown(1).font('Times-Roman').fontSize(18).fillColor(options.textColor).text('Nato/a a         '+ studente.luogoNascita,{align:'left'})
  pdf.moveDown(1).font('Times-Roman').fontSize(18).fillColor(options.textColor).text('Il               '+ studente.dataNascita.getDate()+"/"+( studente.dataNascita.getMonth() +1)+"/"+ studente.dataNascita.getFullYear(),{align:'left'})
  pdf.moveDown(1).font('Times-Roman').fontSize(18).fillColor(options.textColor).text('Residenza         '+ studente.residenza.comune+', '+ studente.residenza.indirizzo.via+' '+ studente.residenza.indirizzo.numeroCivico,{align:'left'})
  pdf.moveDown(8).font('Times-Italic').fontSize(18).fillColor(options.textColor).text('Anno Scolastico '+classe.annoScolastico.split("/")[0]+'/20'+classe.annoScolastico.split("/")[1],{align:'right'})
  pdf.moveDown(1).font('Times-Roman').fontSize(18).fillColor(options.textColor).text('Classe '+classe.classe+' sez. '+classe.sezione ,{align: 'right'})
  pdf.moveDown(1).font('Times-Roman').fontSize(18).fillColor(options.textColor).text('Scuola Primaria',{align: 'right'})
  //Second page
  pdf.addPage()
  pdf.moveDown(4).font('Times-Bold').fontSize(12).fillColor(options.textColor).text('Federazione delle Scuole Steiner-Waldorf in Italia',{align:'center'})
  pdf.moveDown(0).font('Times-Bold').fontSize(10).fillColor(options.textColor).text('Sede legale: Via Rudolf Steiner, 2-4-6 31020 Zoppè di San Vendemmiano (TV)',{align:'center'})

  return 0
}
let addFooter = (pdf,studente,classe,options)=>{
  let statoAmmissione;
  if(studente.ammesso){
    statoAmmissione = "ammesso/a"
  }
  else{
    statoAmmissione = "non ammesso/a"
  }
  //First Page
  pdf.addPage()
    //Riquadro
    pdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(options.gridColor);
    pdf.moveTo(215,50).lineTo(215,125).stroke(options.gridColor);
    pdf.moveTo(380,50).lineTo(380,125).stroke(options.gridColor);
      //Primo Settore
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Scuola Rudolf Steiner",60,75);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Trento",110,100);
      //Secondo Settore
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Alunno/a",265,75);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text(studente.cognome +" "+studente.nome,245,100);
      //Terzo Settore
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Anno Scolastico",410,75);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text(classe.annoScolastico,430,100);
      //Sotto riquadro
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Validazione dell'anno scolastico",200,185);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Ai fini della validità dell'anno scolastico, l'alunno/a"+studente.cognome+" "+studente.nome+" ha frequentato le lezioni per almeno tre quarti dell'orario scolastico.",70,230);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("L'insegnante di classe",50,350);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("..........................................",50,380);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Firma di uno dei genitori o di chi ne fa le veci",50,450);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("..........................................",50,480);
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
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),50,560);
      pdf.moveTo(50,175).lineTo(545,175).lineTo(545,300).lineTo(50,300).lineTo(50,175).stroke(options.gridColor);

  //Second Page
  pdf.addPage();
    pdf.font('Times-Roman').fontSize(20).fillColor(options.textColor).text("Attestato",{align:'center'});
    pdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Vista la valutazione del Collegio di Classe in sede di scrutinio finale, si attesta che l'alunno/a "+studente.cognome+" "+studente.nome+" è "+statoAmmissione+" alla classe successiva",{align:'center'});
    pdf.moveDown(4).font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Il Coordinatore Didattico ("+options.corDidattico.titolo+". "+options.corDidattico.nome+" "+options.corDidattico.cognome+")",{align:'left'});
    //pdf.font('Times-Roman').fontSize(16).fillColor(info.textColor).text("(prof. Carlo Musio)",{align:'left'});
    pdf.moveDown(2).font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Trento, "+ dataOggi.getDate() + " " + mese + " " + dataOggi.getFullYear(),{align:'left'});
    //Riquadro a pie pagina
    pdf.moveTo(50,600).lineTo(545,600).lineTo(545,700).lineTo(50,700).lineTo(50,600).stroke(options.grid);
      //Testo riquadro pie pagina
      pdf.font('Times-Roman').fontSize(14).fillColor(options.textColor).text("Associazione Pedagogica Steineriana",200,610);
      pdf.font('Times-Roman').fontSize(22).fillColor(options.textColor).text("SCUOLA RUDOLF STEINER",175,635);
      pdf.font('Times-Roman').fontSize(8).fillColor(options.textColor).text("PARITARIA COMPRENSIVA DI SCUOLA PRIMARIA E SECONDARIA DI PRIMO GRADO",150,660);
      pdf.font('Times-Roman').fontSize(8).fillColor(options.textColor).text("(DETERMINAZIONE DEL DIRIGENTE N. 41 DEL 31 MARZO 2009",200,670);
      pdf.font('Times-Roman').fontSize(14).fillColor(options.textColor).text("Via Conci, n. 86 - 38123 TRENTO",200,680);

}
let addPagelleSemestre = (pdf,studente,classe,options)=>{
  let quadrimesre;
  if(options.semestre == 1){
    quadrimesre = "I"
  }
  else{
    quadrimesre = "II"
  }
  //First Page
  pdf.addPage()
    //Riquadro
    pdf.moveTo(50,50).lineTo(545,50).lineTo(545,125).lineTo(50,125).lineTo(50,50).stroke(options.gridColor);
    pdf.moveTo(50,125).lineTo(545,125).lineTo(545,150).lineTo(50,150).lineTo(50,125).stroke(options.gridColor);
    pdf.moveTo(215,50).lineTo(215,150).stroke(options.gridColor);
    pdf.moveTo(380,50).lineTo(380,150).stroke(options.gridColor);
      //Primo Settore
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Scuola Rudolf Steiner",60,75);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Trento",110,100);
      //Secondo Settore
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Alunno/a",265,75);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text(studente.cognome +" "+studente.nome,245,100);
      //Terzo Settore
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text("Anno Scolastico",410,75);
      pdf.font('Times-Roman').fontSize(16).fillColor(options.textColor).text(classe.annoScolastico,430,100);
      //Terzo Settore, seconda riga
      pdf.font('Times-Bold').fontSize(12).fillColor(options.textColor).text(""+quadrimesre+" QUADRIMESTRE",410,135);
      //Header centrale post riquadro
      pdf.font('Times-Bold').fontSize(16).fillColor(options.textColor).text("Relazione del Collegio di Classe",190,165);
      pdf.font('Times-Bold').fontSize(16).fillColor(options.textColor).text("",50,200);

  //Aggiunta Pagelle
  studente.pagelleMaterie.map(pagella=>{
    pdf.font('Helvetica-Bold').fontSize(10).moveDown(1).text(pagella.materia+' :')
    if(options.semestre == 1){
      pdf.moveDown(1).font('Helvetica').fontSize(options.fontSize).text(pagella.primoSemestre)
    }
    else{
      pdf.moveDown(1).font('Helvetica').fontSize(options.fontSize).text(pagella.secondoSemestre)
    }
  })
}

router.post('/stampaStudente/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:id',async function (req,res,next){

  let options = {
    semestre: req.body.semestre,
    fontSize: req.body.fontSize,
    textColor: '#515151',
    gridColor: '#bec0be',
    corDidattico:{
      titolo:'prof',
      nome:'Roberto',
      cognome:'Dalema'
    }
  }

  try{
    const materie = Classi.getMaterieSezione(req.params.as,req.params.classe,req.params.sezione);
    const infoStudente = Studenti.getInfoStudente(req.params.id);

    let classe = {
      annoScolastico: req.params.as,
      classe : req.params.classe,
      sezione: req.params.sezione,
      materie: await materie,
    }
    let studente = await infoStudente

    let pagelleMateriePromises = classe.materie.map(async m=>Pagelle.getPagellaFromStudente(classe.annoScolastico,classe.classe,classe.sezione,m,studente.id))
    studente.pagelleMaterie = await Promise.all(pagelleMateriePromises)

    let newPDF = new pdfKit();
    addHeader(newPDF,studente,classe,options);
    addPagelleSemestre(newPDF,studente,classe,options);
    addFooter(newPDF,studente,classe,options);

    newPDF.pipe(res);
    newPDF.end();

  }
  catch(err){
    req.session.errorMsg = "Errore durante la creazione del PDF : " + err;
    res.redirect('/admin/gestioneAnni/' + req.params.as +"/" + req.params.classe +"/"+req.params.sezione)
  }

});


router.post('/stampaSezione/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione',async function (req,res,next){

  let options = {
    semestre: req.body.semestre,
    fontSize: req.body.fontSize,
    textColor: '#515151',
    gridColor: '#bec0be',
    corDidattico:{
      titolo:'prof.',
      nome:'Roberto',
      cognome:'Dalema'
    }
  }

  try{
    const idStudentiPromise = Classi.getStudentiFromAnnoScolasticoAndClasseAndSezione(req.params.as,req.params.classe,req.params.sezione)
    const materiePromise = Classi.getMaterieSezione(req.params.as,req.params.classe,req.params.sezione)
    const infoStudentiPromise = Studenti.getInfoStudentiById(await idStudentiPromise)

    let classe = {
      annoScolastico: req.params.as,
      classe : req.params.classe,
      sezione: req.params.sezione,
      materie: await materiePromise,
      studenti: await infoStudentiPromise
    }
    let newPDF = new pdfKit();
    for(studente of classe.studenti){
      studente.pagelleMateriePromises = classe.materie.map(async m=>Pagelle.getPagellaFromStudente(classe.annoScolastico,classe.classe,classe.sezione,m,studente.id));
    }
    for(studente of classe.studenti){
      studente.pagelleMaterie = await Promise.all(studente.pagelleMateriePromises)
      addHeader(newPDF,studente,classe,options);
      addPagelleSemestre(newPDF,studente,classe,options);
      addFooter(newPDF,studente,classe,options);
    }
    newPDF.pipe(res);
    newPDF.end();
  }
  catch(err){
    req.session.errorMsg = "Errore durante la creazione del PDF : " + err;
    res.redirect('/admin/gestioneAnni/' + req.params.as +"/" + req.params.classe)
  }


});


router.post('/stampaClasse/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])',async function (req,res,next){
  let newPDF = new pdfKit();
  let options = {
    semestre: req.body.semestre,
    fontSize: req.body.fontSize,
    textColor: '#515151',
    gridColor: '#bec0be',
    corDidattico:{
      titolo:'prof.',
      nome:'Roberto',
      cognome:'Dalema'
    }
  }
  try{
    const sezioni = await Classi.getSezioniFromAnnoScolasticoAndClasse(req.params.as,req.params.classe);
    for(sezione of sezioni){
          const idStudentiPromise = await Classi.getStudentiFromAnnoScolasticoAndClasseAndSezione(req.params.as,req.params.classe,sezione)
          const materiePromise = await Classi.getMaterieSezione(req.params.as,req.params.classe,sezione)
          const infoStudentiPromise = await Studenti.getInfoStudentiById( idStudentiPromise)
          let classe = {
            annoScolastico: req.params.as,
            classe : req.params.classe,
            sezione: sezione,
            materie: materiePromise,
            studenti: infoStudentiPromise
          }
          for(studente of classe.studenti){
              studente.pagelleMateriePromises = classe.materie.map(async m=>Pagelle.getPagellaFromStudente(classe.annoScolastico,classe.classe,classe.sezione,m,studente.id));
          }
          for(studente of classe.studenti){
              studente.pagelleMaterie = await Promise.all(studente.pagelleMateriePromises)
              addHeader(newPDF,studente,classe,options);
              addPagelleSemestre(newPDF,studente,classe,options);
              addFooter(newPDF,studente,classe,options);
          }
    }
    newPDF.pipe(res);
    newPDF.end();
  }
  catch(err){
    req.session.errorMsg = "Errore durante la creazione del PDF : " + err;
    res.redirect('/admin/gestioneAnni/' + req.params.as)
  }
});


router.post('/stampaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',async function (req,res,next){
  let newPDF = new pdfKit();
  let options = {
    semestre: req.body.semestre,
    fontSize: req.body.fontSize,
    textColor: '#515151',
    gridColor: '#bec0be',
    corDidattico:{
      titolo:'prof.',
      nome:'Roberto',
      cognome:'Dalema'
    }
  }
  try{
    const classi = await Classi.getClassiFromAnnoScolastico(req.params.as);
    for(classe of classi){
        const sezioni = await Classi.getSezioniFromAnnoScolasticoAndClasse(req.params.as,classe);
        for(sezione of sezioni){
            const idStudentiPromise = Classi.getStudentiFromAnnoScolasticoAndClasseAndSezione(req.params.as,classe,sezione)
            const materiePromise = Classi.getMaterieSezione(req.params.as,classe,sezione)
            const infoStudentiPromise = Studenti.getInfoStudentiById(await idStudentiPromise)
            let classeTmp = {
              annoScolastico: req.params.as,
              classe : classe,
              sezione: sezione,
              materie: await materiePromise,
              studenti: await infoStudentiPromise
            }
            for(studente of classeTmp.studenti){
              studente.pagelleMateriePromises = classeTmp.materie.map(async m=>Pagelle.getPagellaFromStudente(classeTmp.annoScolastico,classeTmp.classe,classeTmp.sezione,m,studente.id));
            }
            for(studente of classeTmp.studenti){
                studente.pagelleMaterie = await Promise.all(studente.pagelleMateriePromises)
                addHeader(newPDF,studente,classeTmp,options);
                addPagelleSemestre(newPDF,studente,classeTmp,options);
                addFooter(newPDF,studente,classeTmp,options);
            }
        }
    }
    newPDF.pipe(res);
    newPDF.end();
  }
  catch(err){
    req.session.errorMsg = "Errore durante la creazione del PDF : " + err;
    res.redirect('/admin/gestioneAnni')
  }

});



module.exports = router;
