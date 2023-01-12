
$(document).ready(function(){


})

function handlecheckout(id, appid, username, serviceid){

    alert(id+" : "+username+" : "+appid)

   var datetimeorder =  prompt("Enter Date and Time for Service", "20/01/2019, at 2.00pm")

   var venueorder = prompt("Enter venue: ", "Kenya,Nairobi,CBD,KICC house")

   if(datetimeorder != '' && venueorder != ''){


    var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
 
       var result = JSON.parse(this.responseText)
 
       if(result.code == 200 ){
 
 
         alert('Order was successfully checked out...')
         document.getElementById('btncheck'+id).remove()
 
          
 
       }else{
 
 
           alert("Error Handling order... please try again...")
       }
     }
   };
   xhttp.open("POST", "/handleorder", true);
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xhttp.send("orderid="+id+"&appid="+appid+"&datetime="+datetimeorder+"&venueorder="+venueorder+"&username="+username+"&serviceid="+serviceid);
   }else{

    alert("Fields were empty...")
   }


   

   
}

function handleremoveorder(id){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var result = JSON.parse(this.responseText)

      if(result.code == 200 ){


        alert('Order was successfully removed...')
         document.getElementById('id'+id).remove()

      }else{


          alert("Error deleting order... please try again...")
      }
    }
  };
  xhttp.open("POST", "/deletecartorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("orderid="+id);
}