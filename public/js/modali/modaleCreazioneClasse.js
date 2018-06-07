function openModaleNuovaClasse(reqUrl,title){
    $("#formNuovaClasse").attr("action",reqUrl);
    $("#modalTitleNuovaClasse").html(title);
    $(".modalContentNuovaClasse").css("display","block");
    $(".modal").css("display","block");
}
function closeModaleNuovaClasse(){
    $(".modalContentNuovaClasse").css("display","none");
    $(".modal").css("display","none");
}
