var x = document.getElementsByClassName("imagesIng");


$(document).ready(function(){



if($(document).width() < 771){

    $('.galleryImages').attr('class', 'imagesIng');

    var myIndex = 0;

    //carousel();

    $('#imgNext').on('click' , function(){

    
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}

        $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
    });
    
    $('#imgBack').on('click' , function(){

    
        myIndex--;
        if (myIndex > x.length|| myIndex< 0) {myIndex = 1}

        $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
    });

}else{

    $('.imagesIng').attr('class', 'galleryImages').css('display', 'inline-block');

}
   
})






function carousel() {
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}

    $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
   
   // x[myIndex-1].style.display = "block";
   
    
  if($(document).width() < 771){

    setTimeout(carousel, 8000);   
  }
     
  }

  function handleGallery(){

    var galDiv = document.getElementById('hgallery')

    if(galDiv != null){

        galDiv.setAttribute('id', 'gallery')
       if(document.getElementById('main')!= null) document.getElementById('main').setAttribute('id', 'hmain')
       if(document.getElementById('reel') != null) document.getElementById('reel').setAttribute('id', 'hreel')
       if( document.getElementById('order') != null) document.getElementById('order').setAttribute('id', 'hcontact')
       if(document.getElementById('showservices') != null) document.getElementById('gallery').setAttribute('id', 'hservices')

    }else{

        document.getElementById('gallery').setAttribute('id', 'hgallery')
        document.getElementById('hmain').setAttribute('id', 'main')
    }
  }


  function handleServices(){

    var galDiv = document.getElementById('hservices')

    if(galDiv != null){

        galDiv.setAttribute('id', 'showservices')
       if(document.getElementById('main')!= null) document.getElementById('main').setAttribute('id', 'hmain')
       if(document.getElementById('reel') != null) document.getElementById('reel').setAttribute('id', 'hreel')
       if( document.getElementById('order') != null) document.getElementById('order').setAttribute('id', 'hcontact')
       if(document.getElementById('gallery') != null) document.getElementById('gallery').setAttribute('id', 'hgallery')

    }else{

        document.getElementById('showservices').setAttribute('id', 'hservices')
        document.getElementById('hmain').setAttribute('id', 'main')
    }
  }


  function handleReel(){


    var galDiv = document.getElementById('hreel')

    if(galDiv != null){

        galDiv.setAttribute('id', 'reel')
       if( document.getElementById('main')!= null) document.getElementById('main').setAttribute('id', 'hmain')

        if(document.getElementById('gallery') != null) document.getElementById('gallery').setAttribute('id', 'hgallery')
        if(document.getElementById('order') != null) document.getElementById('order').setAttribute('id', 'hcontact')
        if(document.getElementById('showservices') != null) document.getElementById('gallery').setAttribute('id', 'hservices')

    }else{

        document.getElementById('reel').setAttribute('id', 'hreel')
        document.getElementById('hmain').setAttribute('id', 'main')
    }

  }

  function handleContact(){

    var galDiv = document.getElementById('hcontact')

    if(galDiv != null){

        galDiv.setAttribute('id', 'order')
      if( document.getElementById('main') != null) document.getElementById('main').setAttribute('id', 'hmain')

       if( document.getElementById('reel') != null) document.getElementById('reel').setAttribute('id', 'hreel')
       if( document.getElementById('gallery') != null) document.getElementById('gallery').setAttribute('id', 'hgallery')
       if(document.getElementById('showservices') != null) document.getElementById('gallery').setAttribute('id', 'hservices')

    }else{

        document.getElementById('order').setAttribute('id', 'hcontact')
        document.getElementById('hmain').setAttribute('id', 'main')
    }
  }