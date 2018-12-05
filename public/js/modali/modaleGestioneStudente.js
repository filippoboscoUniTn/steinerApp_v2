function openModaleGestioneStudente (annoScolastico,classe,sezione,nome,cognome,id,formAction,title){
  let getInfoUrl = "/admin/gestioneAnni/getInfoStudente/"+id;
  console.log("formAction = " + formAction)
  $.ajax({
    url:getInfoUrl,
    method:"GET",
  }).done(res=>{
    let currentYear = Number(annoScolastico.split("/")[0])

    for(let i=currentYear-2;i<currentYear+5; i++){
      let anno = String(i).concat("/").concat(String(i+1))
      let value = String(i).concat("/").concat(String(i+1).slice(2,4))
      let selected = false
      if(i==currentYear){selected = true}
      $("#inizioAnnoGestioneStudente").append(new Option(anno,value,true,selected))
    }
    for(let i=1;i<9;i++){
      let selected = false
      if(i==Number(classe)){selected = true}
      $("#classeGestioneStudente").append(new Option(i,i,true,selected))
    }
    for(let i=65;i<72;i++){
      let selected = false
      if(String.fromCharCode(i)==sezione){selected = true}
      $("#sezioneGestioneStudente").append(new Option(String.fromCharCode(i),String.fromCharCode(i),true,selected))
    }
    $("#nomeGestioneStudente").val(res.nome)
    $("#cognomeGestioneStudente").val(res.cognome)
    $("#luogoNascitaGestioneStudente").val(res.luogoNascita);
    $("#dataNascitaGestioneStudente").val(res.dataNascita.split("T")[0])
    $("#comuneGestioneStudente").val(res.residenza.comune)
    $("#capGestioneStudente").val(res.residenza.cap)
    $("#viaGestioneStudente").val(res.residenza.indirizzo.via)
    $("#numeroCivicoGestioneStudente").val(res.residenza.indirizzo.numeroCivico)
    $("#statoAmmissioneGestioneStudente").prop('checked',res.ammesso)
  }).fail(err=>{
    alert("Errore del server : " + err)
  })
  $("#modalTitleGestioneStudente").html(title);
  $("#deleteStudenteBtn").attr("onclick","eliminaStudente('"+id+"','"+annoScolastico+"','"+classe+"','"+sezione+"')")
  $("#formGestioneStudente").attr("action",formAction);

  $("#modaleGestioneStudente").modal("show")
}

function closeModaleGestioneStudente (){
  $("#modaleGestioneStudente").modal("hide")
  $("#inizioAnnoGestioneStudente").empty()
  $("#classeGestioneStudente").empty()
  $("#sezioneGestioneStudente").empty()

}

function eliminaStudente(id,anno,classe,sezione){
  console.log("elimina, id= " + id);
  let reqUrl = "/admin/gestioneAnni/eliminaStudente/" + id;
  $.ajax({
    url:reqUrl,
    method:"POST",
    data:{anno:anno,classe:classe,sezione:sezione}
  })
  .done(res=>{
    window.location.reload(true)
  })
  .fail(err=>{window.location.reload(true)
  })
}
