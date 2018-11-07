function openModaleNuovoStudente (reqUrl,title){
  $("#modalTitleCreaStudente").html(title)
  $("#formCreaStudente").attr("action",reqUrl)
  $("#modalContentCreaStudente").css("display","block")
  $(".modal").css("display","block")
}
function closeModaleCreaStudente (){
  $("#modalContentCreaStudente").css("display","none")
  $(".modal").css("display","none")
}
