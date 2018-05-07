"use strict";
module.exports.intersect = function(a, b) {
    let t = [];
    if(a.length ===0 || b.length ===0){
        return t;
    }
    else{

    }
    for(let i=0;i<a.length;i++){
        let index = b.indexOf(a[i]);
        if(index!== -1){
            t.push(b[index])
        }
    }
    return t;
};