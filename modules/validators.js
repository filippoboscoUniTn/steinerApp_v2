"use strict";

module.exports.registrationValidator = function(req){
  req.checkBody('name','Nome obbligatorio').notEmpty();
  req.checkBody('surname','Cognome obbligatorio').notEmpty();
  req.checkBody('email','Email obbligatoria').notEmpty();
  req.checkBody('email','Indirizzo Email invalido').isEmail();
  req.checkBody('username','Nome utente obbligatorio').notEmpty();
  req.checkBody('username','Nome utente già utilizzato').avalibleUsername(req.body.username);
  req.checkBody('password','Password obbligatorio').notEmpty();
  req.checkBody('password2','Ripetere la password').notEmpty();
  req.checkBody('password','Le passwords non combaciano').equals(req.body.password2);

  return req.getValidationResult()
}
