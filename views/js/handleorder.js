$(document).ready(function(){


})

function handleaddorder(id, quantity){


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var result = JSON.parse(this.responseText)

        if(result.code == 200 ){

           document.getElementById('order'+id).innerHTML = result.result

        }else{


            alert("Error adding Quantity")
        }
      }
    };
    xhttp.open("POST", "/updateorder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id="+id+"&option=add&quantity="+quantity);

}

function handleminusorder(id){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var result = JSON.parse(this.responseText)

        if(result.code == 200 ){

           document.getElementById('order'+id).innerHTML = result.result

        }else{


            alert("Error adding Quantity")
        }
      }
    };
    xhttp.open("POST", "/updateorder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id="+id+"&option=minus&quantity="+quantity);
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
  xhttp.open("POST", "/deleteorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("orderid="+id);
}

function handlecheckout(id){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var result = JSON.parse(this.responseText)

      if(result.code == 200 ){


        alert('Order was successfully checked out...')
        document.getElementById('btncheck'+id).remove()

         

      }else{


          alert("Error checkingout order... please try again...")
      }
    }
  };
  xhttp.open("POST", "/checkoutorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("orderid="+id);
}