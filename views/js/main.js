if (document.readyState === 'loading') {
    // The document is still loading
    console.log('Page is loading...');

    // document.getElementById('loader').style.display = 'block'

} else {
    // The document has finished loading
    console.log('Page has finished loading.');

    
}


// Listen for the DOMContentLoaded event (fires when the HTML is fully parsed)
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired. HTML is fully parsed.');
    document.getElementById('loader').style.display ="none"

});

// Listen for the load event (fires when all resources have finished loading)
window.addEventListener('load', function () {
    console.log('load event fired. All resources have finished loading.');
    document.getElementById('loader').style.display ="none"
});

$(document).ready(function(){


   $('.getStartedLink').on('click', function(e){

    e.preventDefault();


    if($(document).width() <= 770){


        

       $('#showToolbar').on("click", function(){
    
         
            $('.toolbarList').fadeToggle();
    
        });
    
    }

    const hash = this.hash;

    console.log(hash);

    if(hash != ''){

        $('html, body').animate({
            scrollTop: $(this.hash).offset().top
        } , 800);
    }

   })



  
   

    $('#wholesalemenu').on('click', function(){

        $('.sub-wholesale-menu').slideToggle();
    });

    $('#lifestylemenu').on('click', function(){

        $('.sub-lifestyle-menu').slideToggle();
    });

    $('#technologymenu').on('click', function(){

        $('.sub-technology-menu').slideToggle();
    });

    $('#educationmenu').on('click', function(){

        $('.sub-education-menu').slideToggle();
    });

    $('#consultantmenu').on('click', function(){

        $('.sub-consultant-menu').slideToggle();
    });

    $('#beautymenu').on('click', function(){

        $('.sub-beauty-menu').slideToggle();
    });


    $('.menuIcon').on("click", function(){

        if($('.menuList').attr('class') != undefined){
        $('.menuList').show();
        $('.menuList').animate({
            left : "0%"
        }, 1000,function(){
            if($(this).attr("class").match("menuList")){
                $(this).attr("class", "revMenuList");
            }else{

                $(this).attr("class", "menuList");
            }
        })
    }else{

        $('.revMenuList').fadeOut();
        $('.revMenuList').attr("class", "menuList");

        $('.menuList').show();
        $('.menuList').animate({
            left : "-80%"
        }, 1000,function(){
           
        })
    }
    })

    carousel();
})

var myIndex = 0;
function carousel() {
    var i;
    var x = document.getElementsByClassName("imgCas");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}

    $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
   
   // x[myIndex-1].style.display = "block"; 
    
  
    setTimeout(carousel, 8000);    
  }

  function openShare(){

    $('.sharethis-inline-share-buttons').fadeToggle();
  }

  console.log(document.getElementsByTagName('form'))

  const forms = document.getElementsByTagName('form');

for (let i = 0; i < forms.length; i++) {
  const form = forms[i];
  // Do something with each form element, for example, add an event listener
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    document.getElementById('loader').style.display ="block"

    setTimeout(function () {
        
        document.getElementById('loader').style.display ="none"
    
       
        form.reset(); 
      }, 2000); 

  });
}

 