var express = require('express');
var pdfKit = require('pdfkit');

var annoScolastico = require('../../models/annoScolastico');
var Classi = require('../../models/classi');

var path = require('path');
var fs = require('fs');
const util = require('util')

var router = express.Router();

router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:nome/:cognome/:matricola/:semestre([1-2]$)',function(req,res){
	console.log("hello from toPdf")
	var as = req.params.as;
	var classe = req.params.classe;
	var nome = req.params.nome;
	var cognome = req.params.cognome;
	var semestre = req.body.semestre;
	var sezione = req.params.sezione;
	var matricola = req.params.matricola

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
				newPdf.moveDown(1).font('Helvetica').fontSize(10).text(data,{align:'left'})

			}catch(err){
				newPdf.moveDown(1).font('Helvetica').fontSize(10).text(err,{align:'left'})
			}
		}
		newPdf.pipe(res);
		newPdf.end();
	})
})


router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:classe([1-8])/:sezione/:semestre([1-2]$)',function(req,res,next){

	var as = req.params.as;
	var asDir = String.prototype.concat(as.split("/")[0],'-20',as.split("/")[1])
	var classe = Number(req.params.classe)
	var semestre = req.params.semestre;
	var sezione = req.params.sezione
	Classi.getStudentsAndSubjects(as,classe,sezione,function(err,studenti,materie){
		if(err){
			next(err);
		}
		var newPdf = new pdfKit();
		for(var i=0;i<studenti.length;i++){
			if(i!=0){
				newPdf.addPage();
			}
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
					newPdf.moveDown(1).font('Helvetica').fontSize(10).text(data,{align:'left'})

				}catch(err){
					newPdf.moveDown(1).font('Helvetica').fontSize(10).text(err,{align:'left'})
				}

			}
		}
		newPdf.pipe(res);
		newPdf.end();
	})

})


router.get('/:as(20[0-9][0-9]/[0-9][0-9])/:semestre([1-2]$)',function(req,res,next){

	var as = req.params.as
	var semestre = req.params.semestre
	var asDir = String.prototype.concat(as.split("/")[0],'-20',as.split("/")[1])

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
							newPdf.moveDown(1).font('Helvetica').fontSize(10).text(data,{align:'left'})
						}catch(err){
							newPdf.moveDown(1).font('Helvetica').fontSize(10).text(err,{align:'left'})
						}

					}
				}
			}
			newPdf.end();
			},err=>{
				next(err)
			})
	})
})







module.exports = router;
