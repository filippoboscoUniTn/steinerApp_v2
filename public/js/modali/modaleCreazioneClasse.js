function openModaleNuovaClasse(reqUrl,title){
  for(let i=1;i<9;i++){
    let selected = false
    if(i==1){selected = true}
    $("#classeCreaClasse").append(new Option(i,i,true,selected))
  }
  for(let i=65;i<72;i++){
    let selected = false
    if(String.fromCharCode(i)=='A'){selected = true}
    $("#sezioneCreaClasse").append(new Option(String.fromCharCode(i),String.fromCharCode(i),true,selected))
  }
  $("#formCreaClasse").attr("action",reqUrl);
  $("#modalTitleCreaClasse").html(title);
  $("#modaleNuovaClasse").modal("show")
}
function closeModaleCreaClasse(){
    $("#modaleNuovaClasse").modal("hide")
    $("#classeCreaClasse").empty();
    $("#sezioneCreaClasse").empty();
}
