function openModaleGestioneSezione (annoScolastico,classe,sezione,formAction,title){
  let getInfoUrl = "/admin/gestioneAnni/getMaterie/"+annoScolastico+"/"+classe+"/"+sezione
  let currentYear = Number(annoScolastico.split("/")[0])

  for(let i=currentYear-2;i<currentYear+5; i++){
    let anno = String(i).concat("/").concat(String(i+1))
    let value = String(i).concat("/").concat(String(i+1).slice(2,4))
    let selected = false
    if(i==currentYear){selected = true}
    $("#inizioAnnoGestioneSezione").append(new Option(anno,value,true,selected))
  }
  for(let i=1;i<9;i++){
    let selected = false
    if(i==Number(classe)){selected = true}
    $("#classeGestioneSezione").append(new Option(i,i,true,selected))
  }
  for(let i=65;i<72;i++){
    let selected = false
    if(String.fromCharCode(i)==sezione){selected = true}
    $("#sezioneGestioneSezione").append(new Option(String.fromCharCode(i),String.fromCharCode(i),true,selected))
  }
  $.ajax({
    url:getInfoUrl,
    method:"GET",
  }).done(res=>{
    $("#materieGestioneSezione").val(res.materie);
    $("#nomeMaestroGestioneSezione").val(res.maestroClasse.nome);
    $("#cognomeMaestroGestioneSezione").val(res.maestroClasse.cognome);
  }).fail(err=>{
    alert("Errore del server : " + err)
  })

  $("#modalTitleGestioneSezione").html(title);
  $("#deleteSezioneBtn").attr("onclick","eliminaSezione('"+annoScolastico+"','"+classe+"','"+sezione+"')");
  $("#formGestioneSezione").attr("action",formAction);
  console.log("formAction = " + formAction)
  $("#modaleGestioneSezione").modal("show")
}
function closeModaleGestioneSezione (){
  $("#modaleGestioneSezione").modal('hide');
  $("#inizioAnnoGestioneSezione").empty()
  $("#classeGestioneSezione").empty()
  $("#sezioneGestioneSezione").empty()
}
function eliminaSezione(annoScolastico,classe,sezione){
  console.log("hi from elimina")
  let reqUrl = "/admin/gestioneAnni/eliminaSezione/" + annoScolastico + "/" + classe + "/" + sezione;
  console.log("reqUrl = " + reqUrl)
  $.ajax({
    url:reqUrl,
    method:"POST"
  })
  .done((res)=>{
    window.location.reload(true)
  })
  .fail((err)=>{
    window.location.reload(true)
  })
}
