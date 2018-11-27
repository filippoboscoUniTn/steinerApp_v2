"use strict";
module.exports.intersect = function(a, b) {
    let t;
    if(a.length ===0 || b.length ===0){
        t = [];
    }
    else{
      for(let i=0;i<a.length;i++){
          let index = b.indexOf(a[i]);
          if(index!== -1){
              t.push(b[index])
          }
      }
    }
    return t
};
module.exports.sortAnni = (a,b)=>{
  if(a.annoScolastico < b.annoScolastico){
    return -1
  }
  if(a.annoScolastico > b.annoScolastico){
    return 1
  }
  return 0
}
