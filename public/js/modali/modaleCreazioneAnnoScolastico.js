function openModaleNuovoAnnoScolastico(reqUrl,title){
  $("#modalTitleCreaAnnoScolastico").html(title);
  $("#formCreaAnno").attr("action",reqUrl);
  let currentYear = (new Date()).getFullYear();
  for(let i=currentYear-5;i<currentYear+5; i++){
    let anno = String(i).concat(" / ").concat(String(i+1))
    let value = String(i).concat("/").concat(String(i+1).slice(2,4))
    let selected = false
    if(i==currentYear){selected = true}
    $("#annoScolasticoCreaAnno").append(new Option(anno,value,true,selected))
  }

  $("#modalContentCreaAnnoScolastico").css("display","block");
  $(".modal").css("display","block");
}

function closeModalCreaAnnoScolastico() {
  $("#modalContentCreaAnnoScolastico").css("display","none");
  $(".modal").css("display","none");
  $("#annoScolasticoCreaAnno").empty();
}
