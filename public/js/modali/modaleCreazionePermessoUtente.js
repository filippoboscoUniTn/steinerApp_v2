function closeModaleCreaPermesso(){
  for(let i=1;i<9;i++){
    let id = String.prototype.concat("#inlineCheckbox",i)
    $(id).prop("checked",false);
  }
  $("#materiaPermesso").val("")
  $("#modaleCreaPermesso").modal("hide");
}

function openModaleCreaPermesso(title,formAction){
  $("#modalTitleCreaPermesso").html(title);
  $("#formCreaPermesso").attr("action",formAction);
  $("#modaleCreaPermesso").modal("show");
}
