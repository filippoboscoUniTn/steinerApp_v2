function openModaleNuovoAnnoScolastico(formAction,title){
  $("#modalTitleCreazioneAnnoScolastico").html(title);
  $("#formCreazioneAnnoScolastico").attr("action",formAction);
  let currentYear = (new Date()).getFullYear();
  for(let i=currentYear - 2;i < currentYear + 5; i ++){
    let newOption = $('<option></option>');
    let newOption2 = $('<option></option>');

    newOption.val(String(i));
    newOption.html(String(i));
    newOption2.val(String(i+1));
    newOption2.html(String(i+1));

    if(i === Number(currentYear)){
        newOption.attr("selected","selected");
    }
    if(i === Number(currentYear)){
        newOption2.attr("selected","selected");
    }
    $("#inizioNuovoAnno").append(newOption);
    $("#fineNuovoAnno").append(newOption2);
  }
  $(".modalContentCreazioneAnnoScolastico").css("display","block");
  $(".modal").css("display","block");
}

function closeModaleNuovoAnnoScolastico() {
  $(".modalContentCreazioneAnnoScolastico").css("display","none");
  $(".modal").css("display","none");
}
