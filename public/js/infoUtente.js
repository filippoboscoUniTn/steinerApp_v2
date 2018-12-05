
function deleteUtente(id){
  console.log("hello from deleteUtente, id = " + id);
  $.ajax({
      url:"/admin/gestioneUtenti/utente/"+id+"/deleteUtente",
      method:"POST"
    }).done( (res) =>{
      window.location.replace("/admin/gestioneUtenti")
    }).fail(err=>{
      window.location.reload(true);
    })
}
