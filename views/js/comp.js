
// document.getElementById('joinBtn').addEventListener("click", function(){

//     alert("hello")
// })

function handleGetLeaderBoard(){
   
   

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){

        
         var leaders = JSON.parse("["+xmlHttp.responseText+"]")[0].competitors

         console.log(leaders)

         var tablettd = document.getElementById("contTd");
         for(var x = 0; x < leaders.length; x++){

             let leader = leaders[x]

            tablettd.innerHTML += `<tr class="compDets" >
             <td id="rank">${x}</td>
             <td id ="users" >
                 <a href="http://"  style="display: flex;">
                 <img src="./../images/${leader.userimg}" alt="" style="width: 40px; height: 40px; border-radius: 100px">
                 <span style="color: orangered; font-weight: bolder;">${leader.username}</span>
             </a>
             </td>
             <td id="followers">
                 ${leader.followers}
             </td>
             <td id="likes">
                 ${leader.likes}
             </td>
             <td id="order">
                 ${leader.orders}
             </td>
             <td id="activity">
                 ${leader.active}
             </td>
             <td id="score">
                 ${leader.score}
             </td>
         </tr>`
         }
   
         }     }
    xmlHttp.open("GET", "http://localhost:8087/leaderboard", true); // true for asynchronous 
    xmlHttp.send(null);
    
    
}

function callJoinDiv(auth){
    
   // var joinDiv = document.getElementsByClassName("joinDiv").item(0)

   if(auth){

    document.getElementsByClassName("joinDiv").item(0).setAttribute("class", "joinDiv2")
   }else{

    try{

        window.open('http://localhost:8087/login/')

    }catch(e){
console.log(e)
    }
    
   }
    
}

function hideJoinDiv(){
    document.getElementsByClassName("joinDiv2").item(0).setAttribute("class", "joinDiv")

}

function showLeader(){

if(document.getElementById("dbody") != null){

    document.getElementById("dbody").setAttribute("id", "hdbody")
    document.getElementById("ldiv").setAttribute("id", "sldiv")

    handleGetLeaderBoard()
   
}else{

    document.getElementById("hdbody").setAttribute("id", "dbody")
    document.getElementById("sldiv").setAttribute("id", "ldiv")

        var children = document.getElementsByClassName("compDets")

        //var parent = document.getElementById("contTd").remove()

        for(var x =0; x < children.length; x++){

            children.item(x).remove()
        }

    
}
   
}

function hideLeader(){

    if(document.getElementById("hdbody") != null){
        document.getElementById("hdbody").setAttribute("id", "dbody")
        document.getElementById("sldiv").setAttribute("id", "ldiv")

        var children = document.getElementsByClassName("compDets")

        //var parent = document.getElementById("contTd").remove()

        for(var x =0; x < children.length; x++){

            children.item(x).remove()
        }

    }

   
}

function handleJoinReq(){

    var appid = document.getElementById('businessAppId').value
    var compname = document.getElementById('compname').value
    $.post('http://localhost:8087/post/competitors', {
        appid : parseInt(appid),
        compname : compname
    }, (data, status)=>{

        alert(status)

        if(data.code == 200){

            alert("You have successfully joined the competion /n Best of luck!!")
        }else{

            alert(data.error)
            alert("Error occured please try again... /n make sure you are logged in.")

        }
    })
}

function handleSus(){

   window.open("/AddService?suscription=gold")
}

function handleBasic(){

    window.open("/AddService?suscription=basic")
 }
 function handlePrenium(){

    window.open("/AddService?suscription=prenium")
 }

 function handleDiscSubmission(){

    var username = document.getElementById("username").value
    var userimage = document.getElementById("userimage").value
    var competition_name = document.getElementById("competition_name").value
    var content = document.getElementById("content").value
    var subject = document.getElementById("subject").value

    if(content != null || content != undefined ||content != "" ){

        if(username != "guest"){

        $.post('http://localhost:8087/post/disc', {
        content : content,
        username : username,
        userimage : userimage,
        competition_name : competition_name,
        subject: subject

    }, (data, status)=>{

        alert(status)

        if(data.code == 200){

            document.getElementById("contDiasc").innerHTML += `<div class="discBox" style="display: flex;">
            <div class="discContent">
        <img src="./../images/${userimage}" alt="" srcset="" style="width: 60px; height: 60px; border-radius: 10%;">
    </div>
            <div class="discContent" id="dcontp">
                <h5 style="color: purple;">${username}</h5>

                <h6 style="margin-top: 2px;">${subject}</h6>

                <p class="discPara" style="white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;" >
                   ${content}
                </p>
                <h6> <a href="http://"> view more... </a></h6>
                <span style="font-size: smaller;"><span class="time">just now</span></span> <span style="font-size: smaller; text-align: right; margin-left: 40%;"><span >0 </span> replies</span>
            </div>
        </div>`
            alert("You have successfully joined the competion /n Best of luck!!")
        }else{

            alert(data.error)
            alert("Error occured please try again... /n make sure you are logged in.")

        }
    })


        }else{

            var proceed = confirm("PLease LOGIN to engage in the discussion forum...")
            if(proceed){

                window.open("http://localhost:8087/AddService?suscription=prenium")
            }
        }
    }

}

//............................................../>

function handleSubDiscSubmission(){



    var discmain_id = document.getElementById("discMain_id").value
    var comment = document.getElementById("comment").value
   

    if(discmain_id != null || discmain_id != undefined || comment != "" ){

        if(username != "guest"){

        $.post('/post/discsubs', {
        comment : comment,
        discmain_id : discmain_id

    }, (data, status)=>{

        alert(status)

        if(data.code == 200){

            console.log(data)

            var tablettd = document.getElementById("sb");

            tablettd.innerHTML += ` <div class="discBox commentsDiv" style="display: flex;" >
                       
                   <div class="discContent">
                       <img src="./../images/${data.subss.userimage}" alt="" srcset="" style="width: 50px; height: 50px; border-radius: 100%;">
                   </div>
                           <div class="discContent" id="dcontp">
                               <h5 style="color: purple;">${data.subss.username}</h5>
                   
                               <p class="discPara"  >
                                  ${data.subss.content}
                                
                               </p>             
                             
                               <span style="font-size: smaller;"><span class="time">Just Now</span> </span>
                           </div>
   
               </div>`
            alert("You have successfully joined the competion /n Best of luck!!")
        }else{

            alert(data.error)
            alert("Error occured please try again... /n make sure you are logged in.")

        }
    })


        }else{

            var proceed = confirm("PLease LOGIN to engage in the discussion forum...")
            if(proceed){

                window.open("http://localhost:8087/AddService?suscription=prenium")
            }
        }
    }


}


//......................./>

function handleViewThread(id, username, userimage, content, age , replies, subject){

    if(document.getElementById("showMainDiscs") != null){
        console.log("hide main")
        document.getElementById("showMainDiscs").setAttribute("id", "hideMainDiscs")
        //document.getElementById("showMainDiscs").setAttribute("id", "hideMainDiscs")
        console.log("show subs")
        document.getElementById("hideSubDiscs").setAttribute("id", "showSubDiscs")

        document.getElementById("mainform").setAttribute("id", "hidemainform")

        document.getElementById("commentForm").innerHTML = ` <form onsubmit="event.preventDefault(); handleSubDiscSubmission();" method="post">
            
        <textarea name="content" id="comment" cols="30" rows="3" ></textarea> <br>
        <input type="hidden" id="discMain_id" value=${id}>
        <input type="submit" value="submit">
    </form>`

    }



    if( id != null || id != undefined){

        document.getElementById('fst').innerHTML = `<div class="discContent">
        <img src="./../images/${userimage} alt="" srcset="" style="width: 60px; height: 40px; border-radius: 100%;">
    </div>
            <div class="discContent" id="dcontp">
                <h5 style="color: purple;">${username}</h5>

                <h6 style="margin-top: 2px;">${subject}</h6>

                <p class="discPara" >
                   ${content} 
                </p>
              
                <span style="font-size: smaller;"><span class="time">${age}</span>  ago</span> <span style="font-size: smaller; text-align: right; margin-left: 40%;"><span >${replies} </span> replies</span>
            </div>`


        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
    
            
             var results = JSON.parse("["+xmlHttp.responseText+"]")[0]

             console.log(results)

             if(results.code == 200){


                var tablettd = document.getElementById("sb");
                for(var x = 0; x < results.subDisc.length; x++){
       
                    let leader = results.subDisc[x]
       
                   tablettd.innerHTML += ` <div class="discBox commentsDiv subdiscContent" id="subdiscContent" style="display: flex;" >
                       
                   <div class="discContent">
                       <img src="./../comp//boutique.jpg" alt="" srcset="" style="width: 40px; height: 40px; border-radius: 100%;">
                   </div>
                           <div class="discContent" id="dcontp">
                               <h5 style="color: purple;">${leader.USERNAME}</h5>
                   
                               <p >
                                  ${leader.CONTENT}
                                
                               </p>             
                             
                               <span style="font-size: smaller;"><span class="time">${leader.age}</span>  ago</span>
                           </div>
   
               </div>`
                }


             }else{

                var tablettd = document.getElementById("sb");

                tablettd.innerHTML += `<div class="discBox">
                <h5>There are no discussions on this competition...</h5>
            </div>`


             }
   
             }     }
        xmlHttp.open("GET", "http://localhost:8087/competition/discussions_subs?disc_id="+id, true); // true for asynchronous 
        xmlHttp.send(null);


        
    }
}