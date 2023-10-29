$(document).ready(function(){

    $('.intro').animate({
        left: "0%"
    }, 3000);

    $('.subHead').animate({right: "0%"}, 3000)

    $('.menuIconCat').on('click', function(){

     
        $('.slideExplorenav').animate({

            left: "0%"
        }, 800);
    });


 $('.menuIconCaton').on('click', function(){

    
        $('.slideExplorenav').animate({

          
            left: "-70%"
        }, 800);
    });


});

function handleLike( id, appname, appimage, category){

    document.getElementById('loader').style.display ="block"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        

        document.getElementById('like'+id).setAttribute('src', "./../images/like (1).svg")
  
         alert('You have successfully liked the app')
         document.getElementById('loader').style.display ="none"

     
      }
    //   else{

    //     document.getElementById('loader').style.display ="none"
    //   }
    };
    xhttp.open("POST", "/postlike", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("appid="+id+"&appname="+appname+"&appimage="+appimage+"&cat="+category);
  
  
}


