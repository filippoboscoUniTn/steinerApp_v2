function openModaleGestioneClasse(annoScolastico,classe,formAction,title){
    let opt_id = "optionGestioneClasse_" + classe;
    console.log("Opt_id = " + opt_id)
    $("#" + opt_id).attr("selected","selected");
    $("#modalTitleGestioneClasse").html(title);
    $(".modalContentGestioneClasse").css("display","block");
    $(".modal").css("display","block");
}

function closeModaleGestioneClasse(){
    $(".modalContentGestioneClasse").css("display","none");
    $(".modal").css("display","none");
}
