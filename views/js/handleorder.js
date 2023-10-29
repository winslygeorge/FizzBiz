$(document).ready(function(){


})

function handleaddorder(id, price){

    let q = parseInt(document.getElementById('order'+id).innerHTML)

    document.getElementById('loader').style.display ="block"

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {


        var result = JSON.parse(this.responseText)

        if(result.code == 200 ){

           document.getElementById('order'+id).innerHTML = result.result
           document.getElementById('priceBrk'+id).innerHTML =`${price} * ${result.result} = ${price * result.result}`
           document.getElementById('loader').style.display ="none"



        }else{


            alert("Error adding Quantity")
            document.getElementById('loader').style.display ="none"

        }
      }else{

        // alert("Error adding Quantity")

        // document.getElementById('loader').style.display ="none"
      }
    };
    xhttp.open("POST", "/updateorder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id="+id+"&option=add&quantity="+q);

}

function handleminusorder(id, price){

  let q = parseInt(document.getElementById('order'+id).innerHTML)

  document.getElementById('loader').style.display ="block"


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {


        var result = JSON.parse(this.responseText)

        if(result.code == 200 ){

           document.getElementById('order'+id).innerHTML = result.result
           document.getElementById('priceBrk'+id).innerHTML = `${price} * ${result.result} = ${price * result.result}`
           document.getElementById('loader').style.display ="none"


        }else{


            alert("Error adding Quantity")
            document.getElementById('loader').style.display ="none"

        }
      }else{

        // alert("Error adding Quantity")

        // document.getElementById('loader').style.display ="none"
      }
    };
    xhttp.open("POST", "/updateorder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id="+id+"&option=minus&quantity="+q);
}

function handleremoveorder(id){

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {


      var result = JSON.parse(this.responseText)

      if(result.code == 200 ){


        alert('Order has been cancelled successfully')
         document.getElementById('id'+id).remove()
         document.getElementById('loader').style.display ="none"


      }else{


          alert("Error cancelling order.please try again.")
          document.getElementById('loader').style.display ="none"

      }
    }else{

      // alert("Error cancelling order. please try again")

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/deleteorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("orderid="+id);
}

function handlecheckout(id, username, appid, type){

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

        

      var result = JSON.parse(this.responseText)

      if(result.code == 200 ){


        alert('Order was successfully checked out...')
        document.getElementById('btncheck'+id).remove()
        document.getElementById('loader').style.display ="none"

        if(type === 'service'){

          window.open(`http://localhost:3000/?username=${username}&appid=${appid}&orderid=${id}`, "_blank")


        }


      }else{


          alert("Error checkingout order... please try again...")
          document.getElementById('loader').style.display ="none"
      }
    }else{

      // alert("Error checkingout order... please try again...")


      // document.getElementById('loader').style.display ="none"


    }
  };
  xhttp.open("POST", "/checkoutorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("orderid="+id);
}