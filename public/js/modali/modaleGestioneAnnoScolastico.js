function closeModalGestioneAnnoScolastico(){
    $("#inizioAnno").empty();
    $("#fineAnno").empty();
    $(".modalContentGestioneAnnoScolastico").css("display","none");
    $(".modal").css("display","none");
}

function openModaleGestioneAnnoScolastico(anno,formAction,title){
    $("#modalTitleGestioneAnnoScolastico").html(title);
    let inizioAnno = anno.split("/")[0];
    let fineAnno = String.prototype.concat("20",anno.split("/")[1]);

    for(let i=(Number(inizioAnno)-4);i<(Number(inizioAnno)+6);i++){
        let newOption = $('<option></option>');
        let newOption2 = $('<option></option>');

        newOption.val(String(i));
        newOption.html(String(i));
        newOption2.val(String(i+1));
        newOption2.html(String(i+1));

        if(i === Number(inizioAnno)){
            newOption.attr("selected","selected");
        }
        if(i === Number(fineAnno)-1){
            newOption2.attr("selected","selected");
        }
        $("#inizioAnno").append(newOption);
        $("#fineAnno").append(newOption2);
    }

    $("#formGestioneAnnoScolastico").attr("action",formAction);
    $("#deleteAnnoBtn").attr("onclick","eliminaAnnoScolastico('"+anno+"')");
    $(".modalContentGestioneAnnoScolastico").css("display","block");
    $(".modal").css("display","block");
}

function eliminaAnnoScolastico(anno){
    let reqUrl = "/admin/gestioneAnni/eliminaAnnoScolastico/" + anno;
    $.ajax({
        url:reqUrl,
        method:"POST",
        data:"annoScolastico="+anno
    }).done( (res) =>{
        alert(res);
    })
}
