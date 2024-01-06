
$(document).ready(function(){


})

function handlecheckout(id, appid, username, serviceid, type, email, servicename, businessname, businessemail, serviceimage, category){

   var datetimeorder =  prompt("Enter Date and Time for Service", "20/01/2019, at 2.00pm")

   var venueorder = prompt("Enter venue: ", "Kenya,Nairobi,CBD,KICC house")

   if(datetimeorder != '' && venueorder != ''){

    document.getElementById('loader').style.display ="block"


    var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {

 
       var result = JSON.parse(this.responseText)
 
       if(result.code == 200 ){
 
 
         alert('Order was successfully checked out...')
         document.getElementById('btncheck'+id).remove()
         document.getElementById('loader').style.display ="none"


         if(type === "service"){

          window.open(`https://bookings.fizzbiznetwork.com?username=${username}&orderid=${id}&appid=${appid}`, '_blank');

         }
 
       }else{
 
 
           alert("Error Handling order... please try again...")
           document.getElementById('loader').style.display ="none"

       }
     }else{

        // document.getElementById('loader').style.display ="none"
     }
   };
   xhttp.open("POST", "/handleorder", true);
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xhttp.send("orderid="+id+"&appid="+appid+"&datetime="+datetimeorder+"&venueorder="+venueorder+"&username="+username+"&serviceid="+serviceid+"&email="+email+"&servicename="+servicename+"&businessname="+businessname+"&businessemail="+businessemail+"&serviceimage="+serviceimage+"&category="+category);
   }else{

    alert("Fields were empty...")
   }

}

function handleremoveorder(id, username, email, servicename, businessname){

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var result = JSON.parse(this.responseText)

      if(result.code == 200 ){


        alert('Order was successfully removed...')
         document.getElementById('id'+id).remove()
         document.getElementById('loader').style.display ="none"


      }else{


          alert("Error deleting order... please try again...")
          document.getElementById('loader').style.display ="none"

      }
    }else{

        // document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/deletecartorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`orderid=${id}&username=${username}&email=${email}&servicename=${servicename}&businessname=${businessname}`);
}

function handlecompleteorder(id, username, email, servicename, businessname){

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //  document.getElementById('loader').style.display ="none"

      var result = JSON.parse(this.responseText)

      if(result.code == 200 ){


        alert('Order was successfully removed...')
         document.getElementById('id'+id).remove()

         document.getElementById('loader').style.display ="none"

      }else{


          alert("Error deleting order... please try again...")

          document.getElementById('loader').style.display ="none"
      }
    }else{

      //  document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/completecartorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`orderid=${id}&username=${username}&email=${email}&servicename=${servicename}&businessname=${businessname}`);
}