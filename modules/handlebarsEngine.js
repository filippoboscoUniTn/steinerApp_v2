"use strict";
const hbsexprs = require("express-handlebars");
const path = require('path');
//Modules
const handlebarsHelpers = require('./handlebarsHelpers');

let hbs = hbsexprs.create({
    helpers:handlebarsHelpers,
    partials:'./views/partials',
    extname:'hbs',
    defaultLayout:'authLayout',
    layoutsDir:path.join(__dirname,'..','/views/layouts')
});

module.exports = hbs;