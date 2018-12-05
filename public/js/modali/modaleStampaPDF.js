"use strict";
function closeModaleStampa(){
  $("#modaleStampaPDF").modal("hide");
}

function openModaleStampa(formAction,title) {
    $("#modalTitleStampaPDF").html(title);
    $("#formStampaPDF").attr("action",formAction);
    $("#modaleStampaPDF").modal("show");
}
