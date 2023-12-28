const { JSONParser } = require("formidable/parsers")

function handleUserContact(){

    var galDiv = document.getElementById('hcontact')

    if(galDiv != null){

        galDiv.setAttribute('id', 'contact')
    //  if( document.getElementById('main') != null) document.getElementById('main').setAttribute('id', 'hmain')

    //    if( document.getElementById('reel') != null) document.getElementById('reel').setAttribute('id', 'hreel')
    //     if (document.getElementById('gallery') != null) document.getElementById('gallery').setAttribute('id', 'hgallery')
    if (document.getElementById('hviewedSection') != null) document.getElementById('hviewedSection').setAttribute('id', 'viewedSection')
    if( document.getElementById('mainSections') != null) document.getElementById('mainSections').setAttribute('id', 'hmainSections')
      if (document.getElementById('slike') != null) document.getElementById('slike').setAttribute('id', 'likeSection')
       if( document.getElementById('followSection') != null) document.getElementById('followSection').setAttribute('id', 'hfollowSection')



    }else{

        document.getElementById('contact').setAttribute('id', 'hcontact')
        // document.getElementById('hmain').setAttribute('id', 'main')
         document.getElementById('hmainSections').setAttribute('id', 'mainSections')

    }
}

function handleUserGallery(){

    var galDiv = document.getElementById('hgallery')

    if(galDiv != null){

        galDiv.setAttribute('id', 'gallery')
      if( document.getElementById('main') != null) document.getElementById('main').setAttribute('id', 'hmain')

       if( document.getElementById('reel') != null) document.getElementById('reel').setAttribute('id', 'hreel')
       if( document.getElementById('contact') != null) document.getElementById('gallery').setAttribute('id', 'hcontact')
    }else{

        document.getElementById('gallery').setAttribute('id', 'hgallery')
        document.getElementById('hmain').setAttribute('id', 'main')
    }
}


function handleUserVideos(){
    var galDiv = document.getElementById('hreel')

    if(galDiv != null){

        galDiv.setAttribute('id', 'reel')
      if( document.getElementById('main') != null) document.getElementById('main').setAttribute('id', 'hmain')

       if( document.getElementById('contact') != null) document.getElementById('contact').setAttribute('id', 'hcontact')
       if( document.getElementById('gallery') != null) document.getElementById('gallery').setAttribute('id', 'hgallery')
    }else{

        document.getElementById('reel').setAttribute('id', 'hreel')
        document.getElementById('hmain').setAttribute('id', 'main')
    }
}

function handleUserLikes(){
    var galDiv = document.getElementById('likeSection')

    if(galDiv != null){

        galDiv.setAttribute('id', 'slike')
      if( document.getElementById('mainSections') != null) document.getElementById('mainSections').setAttribute('id', 'hmainSections')

      if (document.getElementById('hviewedSection') != null) document.getElementById('hviewedSection').setAttribute('id', 'viewedSection')
       if( document.getElementById('followSection') != null) document.getElementById('followSection').setAttribute('id', 'hfollowSection')
        if( document.getElementById('contact') != null) document.getElementById('hcontact').setAttribute('id', 'hcontact')

    }else{

        document.getElementById('slike').setAttribute('id', 'likeSection')
        document.getElementById('hmainSections').setAttribute('id', 'mainSections')
    }
}

function handleUserBack(){
    var galDiv = document.getElementById('hmainSections')

    if(galDiv != null){

        galDiv.setAttribute('id', 'mainSections')
      if( document.getElementById('slike') != null) document.getElementById('slike').setAttribute('id', 'likeSection')
      if( document.getElementById('followSection') != null) document.getElementById('followSection').setAttribute('id', 'hfollowSection')

        if (document.getElementById('hviewedSection') != null) document.getElementById('hviewedSection').setAttribute('id', 'viewedSection')
        if( document.getElementById('contact') != null) document.getElementById('contact').setAttribute('id', 'hcontact')

    }
    
}

function handleUserViewed(){
    var galDiv = document.getElementById('viewedSection')

    if(galDiv != null){

        galDiv.setAttribute('id', 'hviewedSection')
      if( document.getElementById('mainSections') != null) document.getElementById('mainSections').setAttribute('id', 'hmainSections')
      if( document.getElementById('followSection') != null) document.getElementById('followSection').setAttribute('id', 'hfollowSection')
        if( document.getElementById('contact') != null) document.getElementById('hcontact').setAttribute('id', 'hcontact')

       if( document.getElementById('slike') != null) document.getElementById('slike').setAttribute('id', 'likeSection')
    }else{

        document.getElementById('hviewedSection').setAttribute('id', 'viewedSection')
        document.getElementById('hmainSections').setAttribute('id', 'mainSections')
    }
}

function handleUserFollows(){
    var galDiv = document.getElementById('hfollowSection')

    if(galDiv != null){

        galDiv.setAttribute('id', 'followSection')
      if( document.getElementById('mainSections') != null) document.getElementById('mainSections').setAttribute('id', 'hmainSections')
      if( document.getElementById('hviewedSection') != null) document.getElementById('hviewedSection').setAttribute('id', 'viewedSection')
        if( document.getElementById('contact') != null) document.getElementById('hcontact').setAttribute('id', 'hcontact')

       if( document.getElementById('slike') != null) document.getElementById('slike').setAttribute('id', 'likeSection')
    }else{

        document.getElementById('followSection').setAttribute('id', 'hfollowSection')
        document.getElementById('hmainSections').setAttribute('id', 'mainSections')
    }
}



function handleBeFriend(username, userimage){

    if(username != null || username != undefined){

        document.getElementById('loader').style.display ="block"


        $.post('/post/friendRequest', {
        receivername : username,
        receiverimage: userimage

    }, (data, status)=>{


        if(data.code == 200){

            document.getElementById('friendsB').innerHTML = `<button onclick="handleCancelBeFriend(${username});"
            style="background-color: lawngreen; color: white; padding:2%; border: 2px solid lawngreen; border-radius:4px; font-weight: bolder;">
            Sent Friend Request</button>`

            document.getElementById('loader').style.display ="none"


        }else{
            alert(`Could not sent Friend request. Please try again later...`)
            document.getElementById('loader').style.display ="none"

        }
    })

    }
}

function handleAcceptFriend(username, userimage, id, friend_id){


    if(username != null || username != undefined){

        document.getElementById('loader').style.display ="block"


        $.post('/post/acceptfriendRequest', {
        receivername : username,
        receiverimage: userimage,
        requestid : id

    }, (data, status)=>{


        if(data.code == 200){

            document.getElementById('friendsAB').innerHTML = `<button onclick="handleCancelFriend(${username}, ${friend_id});"
            style="background-color: green; color: white; padding:2%; border: 2px solid green; border-radius:4px; font-weight: bolder;">
            Friends</button>`
            document.getElementById('loader').style.display ="none"


        }else{
            alert(`Could not Accept Friend request. Please try again later...`)
            document.getElementById('loader').style.display ="none"

        }
    })

    }


}



function handleCancelFriend(username, friend_id, userimage){

    var cancelFriend = confirm(`Are you sure you want to delete ${username} as a friend...`)

    if(cancelFriend){
    

    if(username != null || username != undefined){

        document.getElementById('loader').style.display ="block"


        $.post('/post/cancelfriend', {
        receivername : username,
        friend_id : friend_id

    }, (data, status)=>{



        if(data.code == 200){

            document.getElementById('wfriends').innerHTML = `<button onclick="handleBeFriend(${username}, ${userimage});"
            style="background-color: blueviolet; color: white; padding:2%; border: 2px solid blueviolet; border-radius:4px; font-weight: bolder;">
            Be Friend +</button>`

            document.getElementById('loader').style.display ="none"


        }else{
            alert(`Could not Delete Friend. Please try again later...`)
            document.getElementById('loader').style.display ="none"

        }
    })

    }
}


}

function getUserApps(username) {
    
    document.getElementById('loader').style.display = "block"
    

      $.get('/user/businessapps', {
        loggedUsername : username,
      
    }, (data, status)=>{


          if (data.code === 200) {
            
              let result = data.result

              console.log("res : ", result)

              result?.forEach((app) => {
                  
                  
                  let detApp = document.createElement("div")

                  detApp.className = "details"
                      
                      detApp.innerHTML = `<img
                    src="./../images/${app.BRANDICON}"
                    alt=""
                    srcset=""
                    class="imgIconCompany"
                    height="40px"
                  />
                  <div class="headingIcon">${app.BUSINESSNAME
}
                    <a
                      href="/app/${app.BUSINESSNAME}?id=${app.ID}&cat=${app.BUSINESSCATEGORY}"
                    > <span class="followBtn">visit</span></a></div>`
                  
                  document.getElementById('displayAppsIcon').append(detApp)

                  document.getElementById('fetchAppsBtn').setAttribute("disabled", "disabled")
                  document.getElementById('fetchAppsBtn').style.display = "none"
                  
              })

           
            document.getElementById('loader').style.display ="none"


        }else{
            alert(`${data.error}`)
            document.getElementById('loader').style.display ="none"

        }
    })


}

function handleEmailBtn(useremail, username) {
  var content = $("#content").val();

  var topic = $("#topic").val();

  var email = "";

  if ($("#email").val() == "") {
    email = useremail;
  } else {
    email = $("#email").val();
  }

  document.getElementById('loader').style.display ="block"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var resq = JSON.parse(this.responseText);

      if (resq.code == 200) {
        alert("Email was posted successfully");
        document.getElementById('loader').style.display ="none"

      }else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      } else if (resq.code == 402) {
        
        alert("You currently have no followers to communicate to...");
        document.getElementById('loader').style.display ="none"


      } else {
        alert("Error submitting email...\n please try again");
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/post/private/email", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(
    "email=" +
      email +
      "&username=" +
      username +
    
      "&topic=" +
      topic +
      "&content=" +
      content 
);
}