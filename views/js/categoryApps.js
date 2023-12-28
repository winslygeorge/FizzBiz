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

function searchBusinessApps(){

    let searchValue = document.getElementById('searchbox').value

    let displayApps = document.getElementById('displayAppsSearch')




    if(searchValue && searchValue !== ''){

        displayApps.innerHTML = ``



        document.getElementById('loader').style.display ="block"


        $.get('/search/apps/all', {
            search : searchValue
    
        }, (data, status)=>{
    
    
            if(data.code == 200){

                let fdata = data?.results

                let appscat = fdata?.appscat

            
                console.log(appscat)
                let appscatKeys = Object.keys(appscat)
                let appscatValues = Object.values(appscat)



                for (let x = 0; x < appscatKeys.length; x++){

                    let appsContainer = document.createElement('div')

                    appsContainer.setAttribute('class', 'bidcat')

                    appsContainer.innerHTML = `   <div class="subHead"><h4>${appscatKeys[x]}</h4></div> `

                    let categoryContainer = document.createElement('div')

                    categoryContainer.setAttribute('class', 'category')

                    let categoryList = appscatValues[x]
                    
                    categoryList.forEach(element => {

                        console.log(element)




                        let specificAppContainer = document.createElement('div')

                        specificAppContainer.setAttribute('class', 'specificApp')

                        specificAppContainer.innerHTML = `
                        
                        <div class="details">
                        <img src="./../images/${element.BRANDICON}" alt="" srcset="" class="imgIconCompany" height="40px">
                        <div class="headingIcon"><h5>${element.BUSINESSNAME}</h5></div>
                    </div>

                    <div class="aLink">
                    <a href="/app/${element.BUSINESSNAME}?id=${element.ID}&cat=${element.BUSINESSCATEGORY}">  
                       <img src="./../images/view.svg" alt="" srcset=""> <h5 style="color:purple">View</h5>
                    </a> </div>
                    <img class="appbrandimg" src="./../images/${element.BRANDICON}" alt="" srcset="">
                    <div class="decApp">
                        <h5 class="shortDescTitle" style="color: orange;">${element.SHORTTOPIC}</h5>
                        <h6 style="color: white;">${element.SHORTINTRO}</h6>
                    </div>
                    <div class="likes">
                        <div class="views">
                            <div class="view"><img src="./../images/view.svg" alt="" srcset=""  ></div>
                            <h5>${element.VIEWS_COUNT} views</h5>
                        </div>

                        <div class="views">
                           <div class="like"><img  id="like${element.ID}" src="./../images/like.svg" alt="" srcset="" onclick="handleLike( ${element.ID}, '${element.BUSINESSNAME}', '${element.BRANDICON}', ${element.BUSINESSCATEGORY})"></div> 
                            <h5>${element.LIKE_COUNT} likes</h5>
                        </div>
                    </div>
                        
                        `

                        categoryContainer.appendChild(specificAppContainer)





                        
                    });



                    if(appscatValues[x].length > 0){

                        appsContainer.appendChild(categoryContainer)
                        displayApps.append(appsContainer)
                    }

                   

                }
               
                // displayApps.innerHTML = `
                
                
                // `


                document.getElementById('loader').style.display ="none"

    
            }else{

                document.getElementById('loader').style.display ="none"

            }
    
        })

    }

   
}

