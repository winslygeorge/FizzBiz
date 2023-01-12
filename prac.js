var youtubeid = "https://www.youtube.com/watch?v=OQnRCrEi_64"

 var id;

if (youtubeid.indexOf("&") != -1) {
    
     id = youtubeid.slice(
      youtubeid.indexOf("=") + 1,
      youtubeid.indexOf("&")
    );


} else {
    
     id = youtubeid.slice(
      youtubeid.indexOf("=") + 1
    );


}


console.log(id)