function openModaleGestioneClasse(annoScolastico,classe,formAction,title){
    let opt_id = "optionGestioneClasse_" + classe;
    console.log("Opt_id = " + opt_id)
    $("#" + opt_id).attr("selected","selected");
    $("#modalTitleGestioneClasse").html(title);
    $("#deleteClasseBtn").attr("onclick","eliminaClasse('"+annoScolastico+"','"+classe+"')");
    $("#formClasseGestioneClasse").attr("action",formAction);
    $(".modalContentGestioneClasse").css("display","block");
    $(".modal").css("display","block");
}

function closeModaleGestioneClasse(){
  for(let i=0;i<8;i++){
    let opt_id =  "optionGestioneClasse_" + i;
    $("#" + opt_id).attr("selected",false);
  }
    $(".modalContentGestioneClasse").css("display","none");
    $(".modal").css("display","none");
}

function eliminaClasse(anno,classe) {
  let reqUrl = "/admin/gestioneAnni/eliminaClasse/" + anno + "/" + classe;
  $.ajax({
      url:reqUrl,
      method:"POST",
      data:{"annoScolastico": anno, "classe": classe}
  }).done( (res) =>{
      alert(res);
  })
}
