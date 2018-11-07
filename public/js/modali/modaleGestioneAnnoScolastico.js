function closeModalGestioneAnnoScolastico(){
    $(".modalContentGestioneAnnoScolastico").css("display","none");
    $(".modal").css("display","none");
    $("#annoScolasticoGestioneAnno").empty();

}

function openModaleGestioneAnnoScolastico(annoScolastico,formAction,title){
    let currentYear = Number(annoScolastico.split("/")[0])

    for(let i=currentYear-5;i<currentYear+5; i++){
      let anno = String(i).concat("/").concat(String(i+1))
      let value = String(i).concat("/").concat(String(i+1).slice(2,4))
      let selected = false
      if(i==currentYear){selected = true}
      $("#annoScolasticoGestioneAnno").append(new Option(anno,value,true,selected))
    }

    $("#modalTitleGestioneAnnoScolastico").html(title);
    $("#formGestioneAnno").attr("action",formAction);
    console.log(formAction)
    $("#deleteAnnoBtn").attr("onclick","eliminaAnnoScolastico('"+annoScolastico+"')");

    $(".modalContentGestioneAnnoScolastico").css("display","block");
    $(".modal").css("display","block");
}

function eliminaAnnoScolastico(anno){
    let reqUrl = "/admin/gestioneAnni/eliminaAnnoScolastico/" + anno;
    $.ajax({
        url:reqUrl,
        method:"POST",
        data:"annoScolastico="+anno
    }).done( (res) =>{
      window.location.reload(true);
    }).fail(err=>{
      window.location.reload(true);
    })
}
