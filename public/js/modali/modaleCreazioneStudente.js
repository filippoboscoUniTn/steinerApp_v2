function openModaleNuovoStudente (reqUrl,title){
  $("#modalTitleCreaStudente").html(title)
  $("#formCreaStudente").attr("action",reqUrl)
  $("#openModaleNuovoStudente").modal("show")
}
function closeModaleCreaStudente (){
  $("#openModaleNuovoStudente").modal("hide")
}
