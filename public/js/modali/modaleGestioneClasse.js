function openModaleGestioneClasse(annoScolastico,classe,formAction,title){
  console.log("formAction = " + annoScolastico)
    let currentYear = Number(annoScolastico.split("/")[0])

    for(let i=currentYear-2;i<currentYear+5; i++){
      let anno = String(i).concat("/").concat(String(i+1))
      let value = String(i).concat("/").concat(String(i+1).slice(2,4))
      let selected = false
      if(i==currentYear){selected = true}
      $("#inizioAnnoGestioneClasse").append(new Option(anno,value,true,selected))
    }

    for(let i=1;i<9;i++){
      let selected = false;
      if(i==classe){
        selected = true;
      }
      $("#classeGestioneClasse").append(new Option(i,i,true,selected))
    }

    $("#modalTitleGestioneClasse").html(title);
    $("#deleteClasseBtn").attr("onclick","eliminaClasse('"+annoScolastico+"','"+classe+"')");
    $("#formGestioneClasse").attr("action",formAction);
    $("#modaleGestioneClasse").modal("show");
}

function closeModaleGestioneClasse(){
    $("#modaleGestioneClasse").modal("hide");
    $("#inizioAnnoGestioneClasse").empty()
    $("#classeGestioneClasse").empty()

}

function eliminaClasse(anno,classe) {
  console.log("eliminaClasse")
  let reqUrl = "/admin/gestioneAnni/eliminaClasse/" + anno + "/" + classe;
  $.ajax({
      url:reqUrl,
      method:"POST",
      data:{"annoScolastico": anno, "classe": classe}
  }).done( (res) =>{
      window.location.reload(true);
  }).fail(err=>{
      window.location.reload(true);
  })

}
