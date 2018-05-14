function savePagella(annoScolastico,materia,classe,sezione,nome,cognome,id,semestre,btn){
    let reqUrl = '/pagelle/annoScolastico/'+annoScolastico+'/'+materia+'/'+classe+'/'+sezione+'/'+nome+'/'+cognome+'/'+id+'/'+semestre;
    console.log("reqURL = " + reqUrl);
    let data = "content="+ btn.parentNode.children[0].value;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            if(this.responseText === 'error'){
                alert("Errore salvando la pagella. Riprovare o contattare un amministratore");
            }
            else{
                alert("Pagella salvata con successo!");
            }
        }
    };
    req.open('POST',reqUrl,true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send(data);
}

function collapseForm(divID){
    if($("#"+divID).hasClass("myHidden")){
        $("#"+divID).attr('class','');
    }
    else{
        $("#"+divID).attr('class','myHidden');
    }
}