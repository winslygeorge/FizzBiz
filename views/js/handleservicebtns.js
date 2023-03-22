$(document).ready(function (e) {
  e.preventDefault();
});

function handleorderbtn(id) {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {
        alert("You have successfully placed an order...");
      } else if(result.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      }else {
        alert("An Error occurred when placing the order");
      }
    }
  };
  xhttp.open("POST", "/placeorder", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("serviceid=" + id);
}

function handleRateBtn() {
  $("#ratediv").fadeToggle();
}

function handleSubRateBtn(loggeduser, id) {
  

  var starRateNo = 0;
  for (const key in $(".starCheck")) {
    if ($(".starCheck").hasOwnProperty(key)) {
      const element = $(".starCheck")[key];

      if (element.src == "https://www.fizzbiznet.com/images/star.svg") {
        starRateNo = starRateNo + 1;
      }
    }
  }

  console.log(starRateNo);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var resp = JSON.parse(this.responseText);

      console.log(resp.code);

      if (resp.code == 200) {
        console.log("working");

        var startcounter = 0;
        var innert = "";
        while (startcounter < resp.result) {
          innert =
            innert +
            '<img src="./../images/star.svg" alt="" style="width: 20px;"> ';

          startcounter = startcounter + 1;
        }

        

        document.getElementById("starRate").innerHTML = innert;
      } else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      }else {
        alert("error occurred...");
      }

      $("#ratediv").fadeToggle();
    } else {
      $("#ratediv").fadeToggle();
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

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var resq = JSON.parse(this.responseText);

      if (resq.code == 200) {
        console.log(resq.result);

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
      } else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      }else {
        alert(resq.result);
      }
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

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var resq = JSON.parse(this.responseText);

      if (resq.code == 200) {
        alert("Email was posted successfully");
      }else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      } else if (resq.code == 402) {
        
        alert("You currently have no followers to communicate to...");

      } else {
        alert("Error submitting email...\n please try again");
        console.log(resq.result);
      }
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

function handleLike(id, appname, appimage) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      var resq = JSON.parse(this.responseText);

      if(resq.code == 200){
        alert("You have successfully liked the app");

      }else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      }else{

        alert(resq.result)
      }

      
    }
  };
  xhttp.open("POST", "/postlike", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("appid=" + id + "&appname=" + appname + "&appimage=" + appimage);
}

function handleFollow(id, appname, appimage) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      var resq = JSON.parse(this.responseText);

      if(resq.code == 200){
        alert("You have successfully followed the app");

      }else if(resq.code == 309){
        window.location.replace("https://www.fizzbiznet.com/login");
      }else{

        alert(resq.result)
      }
    
    }
  };
  xhttp.open("POST", "/postfollow", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("appid=" + id + "&appname=" + appname + "&appimage=" + appimage);
}

function handleUpdatemission(id) {
  var mission = prompt("Enter new Mission...", null);

  if (mission != null && mission != "") {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps mission");
        } else {
          alert("Error occured...");
        }
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps Email");
        } else {
          alert("Error occured...");
        }
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps Intro");
        } else {
          alert("Error occured...");
        }
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(this.responseText).code == 200) {
          alert("You have successfully changed the apps Range");
        } else {
          alert("Error occured...");
        }
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
