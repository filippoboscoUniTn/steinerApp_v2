"use strict";
function closeModaleStampa(){
    $(".modalContentStampaPDF").css("display","none");
    $(".modal").css("display","none")
}

function openModaleStampa(formAction,title) {
    $("#modalTitleStampaPDF").html(title);
    $("#formStampaPDF").attr("action",formAction);
    $(".modal").css("display","block");
    $(".modalContentStampaPDF").css("display","block");
}