"use strict";

function eliminaPermesso(deleteUrl){
  console.log("hello from elimina, deleteUrl = " + deleteUrl);
  $.ajax({
    url:deleteUrl,
    method:"POST"
  }).done((res)=>{
    console.log("success");
    window.location.reload(true);
  }).fail(err=>{
    console.log("failed");
    window.location.reload(true);
  })

}
