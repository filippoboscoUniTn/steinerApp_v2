function openModaleNuovaSezione (reqUrl,title){
  let currentYear = (new Date()).getFullYear();
  for(let i=currentYear-2;i<currentYear+5; i++){
    let anno = String(i).concat("/").concat(String(i+1))
    let value = String(i).concat("/").concat(String(i+1).slice(2,4))
    let selected = false
    if(i==currentYear){selected = true}
    $("#inizioAnnoCreaSezione").append(new Option(anno,value,true,selected))
  }
  for(let i=1;i<9;i++){
    let selected = false
    if(i==1){selected = true}
    $("#classeCreaSezione").append(new Option(i,i,true,selected))
  }
  for(let i=65;i<72;i++){
    let selected = false
    if(String.fromCharCode(i)=='A'){selected = true}
    $("#sezioneCreaSezione").append(new Option(String.fromCharCode(i),String.fromCharCode(i),true,selected))
  }
  $("#modalTitleCreaSezione").html(title)
  $("#formCreaSezione").attr("action",reqUrl)
  $("#modaleNuovaSezione").modal("show")
}
function closeModaleCreaSezione (){
  $("#modaleNuovaSezione").modal("hide")
  $("#inizioAnnoCreaSezione").empty();
  $("#classeCreaSezione").empty();
  $("#sezioneCreaSezione").empty();
}
