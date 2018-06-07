const express = require('express');

let router = express.Router();


router.post('/stampaAnnoScolastico/:as(20[0-9][0-9]/[0-9][0-9]$)',function (req,res,next){
    console.log(req.url);
    res.send(req.url);
});



module.exports = router;