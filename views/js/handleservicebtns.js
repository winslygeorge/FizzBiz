$(document).ready(function (e) {
  e.preventDefault();
});

function handleorderbtn(id, type){

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {
        alert("You have successfully placed an order...");
        document.getElementById('loader').style.display ="none"

      } else if(result.code == 309){
        alert(result.result)
        document.getElementById('loader').style.display ="none"

      }else {
        alert("An Error occurred when placing the order");
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/placeorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("serviceid=" + id+"&type=" + type);
}

function handleRateBtn() {
  $("#ratediv").fadeToggle();
}

function handleSubRateBtn(loggeduser, id) {
  

  var starRateNo = 0;

  // Use jQuery to select all elements with the class "starCheck"
  $(".starCheck").each(function(index, element) {
    // Get the src attribute of the current element
    var src = $(element).attr("src");
  
    // Check if the src attribute matches the desired value
    if (src === "./../images/star.svg") {
      starRateNo++;
    }
  });
  
  console.log(starRateNo);

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var resp = JSON.parse(this.responseText);

      if (resp.code == 200) {
 

        var startcounter = 0;
        var innert = "";
        while (startcounter < resp.result) {
          innert =
            innert +
            '<img src="./../images/star.svg" alt="" style="width: 20px;"> ';

          startcounter = startcounter + 1;
        }

        

        document.getElementById("starRate").innerHTML = innert;
        document.getElementById('loader').style.display ="none"

      } else if(resp.code == 309){
        window.location.replace("https://www.fizzbiznetwork.com/login");
      }else {
        alert("error occurred...");
        document.getElementById('loader').style.display ="none"

      }

      $("#ratediv").fadeToggle();
    } else {
      $("#ratediv").fadeToggle();
      // document.getElementById('loader').style.display ="none"

    }
  };

  console.log(starRateNo)
  xhttp.open("POST", "/updateapprate", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(
    "loggeduser=" + loggeduser + "&starno=" + starRateNo + "&appid=" + id
  );
}
function startClicked(no) {
  if (
    document.getElementById(no).getAttribute("src") ==
    "./../images/star (1).svg"
  ) {
    document.getElementById(no).setAttribute("src", "./../images/star.svg");
  } else {
    document.getElementById(no).setAttribute("src", "./../images/star (1).svg");
  }
}

function handlecommentbtn(id, username, profileimage) {
  var comment = $("#comment").val();

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var resq = JSON.parse(this.responseText);

      if (resq.code == 200) {
    

        var jsonres = resq.result;

        var resultcounter = jsonres.length - 1;
        var innert = "";
        while (resultcounter >= 0) {
          var commentt = resq.result[resultcounter];
          innert =
            innert +
            ` <div class="review">
          <div class="clientDetail">

              <div class="profileImg">
                  <img src="./../images/${commentt.PROFILEIMAGE}" alt="" srcset="">

              </div>

              <div class="profilename"> <h5>${commentt.USERNAME}</h5></div>
             
          </div>
         
          <p>${commentt.BUSINESSREVIEWS}</p>

      </div>`;

          resultcounter--;
        }

        document.getElementById("reviewsSection").innerHTML = innert;
        document.getElementById('loader').style.display ="none"

      } else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznetwork.com/login");
      }else {
        alert("Error occured...");

        document.getElementById('loader').style.display ="none"

      }
    }else{

      // alert("Error occured...");


      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/postcomment", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(
    "comment=" +
      comment +
      "&username=" +
      username +
      "&appid=" +
      id +
      "&profileimage=" +
      profileimage
  );
}

function handleEmailBtn(appemail, useremail, username, appname, appid) {
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
        window.location.replace("https://www.fizzbiznetwork.com/login");
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
  xhttp.open("POST", "/postemail", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(
    "email=" +
      email +
      "&username=" +
      username +
      "&appemail=" +
      appemail +
      "&topic=" +
      topic +
      "&content=" +
      content +
      "&appname=" +
      appname +
      "&appid=" +
      appid
  );
}

function handleLike(id, appname, appimage, cat) {

  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      var resq = JSON.parse(this.responseText);

      if(resq.code == 200){
        alert("You have successfully liked the app");
        document.getElementById('loader').style.display ="none"


      }else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznetwork.com/login");
      }else{

        alert("Error occured...");

        document.getElementById('loader').style.display ="none"

      }

      
    }else{

      // alert("Error occured...");


      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/postlike", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("appid=" + id + "&appname=" + appname + "&appimage=" + appimage + "&cat=" + cat);
}

function handleFollow(id, appname, appimage) {


  document.getElementById('loader').style.display ="block"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      var resq = JSON.parse(this.responseText);

      if(resq.code == 200){
        alert("You have successfully followed the app");
        document.getElementById('loader').style.display ="none"


      }else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznetwork.com/login");
      }else{

        alert("Error occured...");


        document.getElementById('loader').style.display ="none"

      }
    
    }else{
      // alert("Error occured...");


      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("POST", "/postfollow", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("appid=" + id + "&appname=" + appname + "&appimage=" + appimage);
}

function handleUpdatemission(id) {
  var mission = prompt("Enter new Mission...", null);

  if (mission != null && mission != "") {

    document.getElementById('loader').style.display ="block"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps mission");
          document.getElementById('loader').style.display ="none"

        } else {
          alert("Error occured...");
          document.getElementById('loader').style.display ="none"

        }
      }else{


        // alert("Error occured...");

        // document.getElementById('loader').style.display ="none"
      }
    };
    xhttp.open("POST", "/updatemission", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("appid=" + id + "&mission=" + mission);
  } else {
    alert("NO changes was received..");
  }
}

function handleEditIcon() {
  $(".editIcon").fadeToggle();
}

function handleUpdateEmail(id) {
  var mission = prompt("Enter new Email...", null);

  if (mission != null && mission != "") {

    document.getElementById('loader').style.display ="block"

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps Email");
          document.getElementById('loader').style.display ="none"

        } else {
          alert("Error occured...");
          document.getElementById('loader').style.display ="none"

        }
      }else{
        // alert("Error occured...");


        // document.getElementById('loader').style.display ="none"
      }
    };
    xhttp.open("POST", "/updateEmail", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("appid=" + id + "&email=" + mission);
  } else {
    alert("NO changes was received..");
  }
}

function handleUpdateIntro(id) {
  var mission = prompt("Enter new Short Intro...", null);

  if (mission != null && mission != "") {
    document.getElementById('loader').style.display ="block"

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps Intro");
          document.getElementById('loader').style.display ="none"

        } else {
          alert("Error occured...");
          document.getElementById('loader').style.display ="none"

        }
      }else{

        // alert("Error occured...");

        // document.getElementById('loader').style.display ="none"

      }
    };
    xhttp.open("POST", "/updateIntro", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("appid=" + id + "&intro=" + mission);
  } else {
    alert("NO changes was received..");
  }
}

function handleUpdateRange(id) {
  var mission = prompt("Enter new Business Range...", null);

  if (mission != null && mission != "") {
    document.getElementById('loader').style.display ="block"

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps Range");
          document.getElementById('loader').style.display ="none"

        } else {
          alert("Error occured...");
          document.getElementById('loader').style.display ="none"

        }
      }else{

        // alert("Error occured...");

        // document.getElementById('loader').style.display ="none"

      }
    };
    xhttp.open("POST", "/updaterange", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("appid=" + id + "&range=" + mission);
  } else {
    alert("NO changes was received..");
  }
}

function handleAddService() {
  $(".addServiceProduct").fadeToggle();
}

function handleAddLocation() {
  $(".addLocation").fadeToggle();
}

function handleAddImage() {
  $(".addImage").slideToggle();
}

function handleAddVideo() {
  $(".addVideo").slideToggle();
}

function handleFileChange(e) {
  var imgElement = document.getElementById("imgDisChange");

  if (!e.target.files.length) return (imgElement.src = "");

  return (imgElement.src = URL.createObjectURL(e.target.files.item(0)));
}

function handleLoader(){

  document.getElementById('loader').style.display = 'block'
}