function handleUserContact(){

    var galDiv = document.getElementById('hcontact')

    if(galDiv != null){

        galDiv.setAttribute('id', 'contact')
      if( document.getElementById('main') != null) document.getElementById('main').setAttribute('id', 'hmain')

       if( document.getElementById('reel') != null) document.getElementById('reel').setAttribute('id', 'hreel')
       if( document.getElementById('gallery') != null) document.getElementById('gallery').setAttribute('id', 'hgallery')
    }else{

        document.getElementById('contact').setAttribute('id', 'hcontact')
        document.getElementById('hmain').setAttribute('id', 'main')
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
    

      $.post('/users/apps', {
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
            alert(`${data.code}`)
            document.getElementById('loader').style.display ="none"

        }
    })


}