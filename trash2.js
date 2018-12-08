let ret='<br>';
ret += '<p class="offset-md-1 h5 mt-2"> Permessi Utente';
for(let i=0;i<permessi.length;i++){
  let deleteParams;
  if((i+2)%2===0){
    ret += '<div class="row">'
    ret += '<div class="col-sm-12 col-md-4 offset-md-1 gray-xl"><h4>'+permessiAnno[0].permessi[i].materia+'</h4>'
      ret += '<form action="/" method="POST" class="form-inline">'
          for(let c=0;c<8;c++){
            ret += '<div class="form-check form-check-inline">';
              ret += '<input class="form-check-input" type="checkbox" value="'+(c+1)+'" id="defaultCheck'+c+ '"';
              if(permessiAnno[0].permessi[i].classi.indexOf((c+1)) !== -1 ){
                ret += ' checked>';
              }
              else{
                ret += '>';
              }
              ret += '<label class="form-check-label" for="defaultCheck'+c+'">'+ (c+1) + '</label>'
            ret += '</div>'
          }
          ret+="<div class='w-100'></div>"
          ret+= '<button class="btn btn-sm btn-success mt-3" type="submit">Salva</button>'
          ret+= '<button class="btn btn-sm btn-danger mt-3 ml-2" type="button" onclick="eliminaPermesso('+deleteParams+')">Elimina</button>'
      ret += '</form>'
  ret +='</div>'
  }
  else{
    ret += '<div class="col-sm-12 col-md-4 offset-md-1 gray-xl"><h4>'+permessiAnno[0].permessi[i].materia+'</h4>'
      ret += '<form action="/" method="POST" class="form-inline">'
          for(let c=0;c<8;c++){
            ret += '<div class="form-check form-check-inline">';
              ret += '<input class="form-check-input" type="checkbox" value="' +(c+1)+ '" id="defaultCheck' +c+ '"';
              if(permessiAnno[0].permessi[i].classi.indexOf((c+1)) !== -1 ){
                ret += ' checked>';
              }
              else{
                ret += '>';
              }
              ret += '<label class="form-check-label" for="defaultCheck'+c+'">'+ (c+1) + '</label>'
            ret += '</div>'
          }
          ret+="<div class='w-100'></div>"
          ret+= '<button class="btn btn-sm btn-success mt-3" type="submit">Salva</button>'
          ret+= '<button class="btn btn-sm btn-danger mt-3 ml-2" type="button" onclick="eliminaPermesso()">Elimina</button>'
      ret += '</form>'
  ret +='</div>'
  ret += '</div>'
  }
}
