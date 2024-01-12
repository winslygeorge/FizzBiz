$(document).ready(function (e) {
  e.preventDefault();
});



function fetchServices(id){

  document.getElementById('loader').style.display ="block"

  let serviceMainDiv = document.getElementById('serviceMainCol')
  serviceMainDiv.innerHTML = ''


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {
        document.getElementById('loader').style.display ="none"

        let services = result?.services

        services?.map((service)=>{

          let  serviceDiv = document.createElement('div')

          serviceDiv.setAttribute('class', 'serDivs')
          serviceDiv.setAttribute('id', `service${service?.SERVICEID}`)

          serviceDiv.innerHTML = `
            <h3>${service?.SERVICENAME}</h3>
            <img
              src="./../images/${service?.SERVICEICON}"
              alt=""
              srcset=""
              style="width: 80%; margin:5px; border-radius: 5px; box-shadow: 2px 2px 2px 2px grey;"
            />
            <p>
              <strong>Description:</strong><br /><br />
              ${service?.SERVICEDESC}
            </p>

            <br />
            <p>
              <b>${service?.PRICE}
                .ksh
                <button
                  id="addorder"
                  onclick="handleorderbtn(${service?.ID}, '${service?.TYPE}');"
                >+</button></b></p>

          </div>

          <div>

      `

      serviceMainDiv.append(serviceDiv)

        })

      } else if(result.code == 201){
        serviceMainDiv.innerHTML = result?.message
        document.getElementById('loader').style.display ="none"

      }else {
        serviceMainDiv.innerHTML = "An Error occurred when fetching service/products"
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("GET", "/get-services/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}


function fetchImages(id){

  document.getElementById('loader').style.display ="block"

  let imageMainDiv = document.getElementById('gallerycarosol')
  imageMainDiv.innerHTML = ''


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {
        document.getElementById('loader').style.display ="none"

        let images = result?.images

        images?.map((image)=>{

          let  imageDiv = document.createElement("img")

          imageDiv.setAttribute('alt', 'imageDiv')
          imageDiv.setAttribute('src', `./../images/${image?.IMAGELINK}`)

          imageDiv.setAttribute('class', 'imagesIng')
          imageDiv.setAttribute('id', 'img1')


      //     imageDiv.innerHTML = `
         
      //     <img
      //       src="./../images/${image?.IMAGELINK}"
            
      //       alt=""
      //       srcset=""
      //       id="img1"

      //     />

      // `
      imageMainDiv.append(imageDiv)

        })

      } else if(result.code == 201){
        imageMainDiv.innerHTML =result?.message
        document.getElementById('loader').style.display ="none"

      }else {
        imageMainDiv.innerHTML = "An Error occurred when fetching Images"
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("GET", "/get-images/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}


function fetchVideos(id){

  document.getElementById('loader').style.display ="block"

  let imageMainDiv = document.getElementById('videosMainCol')

  imageMainDiv.innerHTML = ''


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {
        document.getElementById('loader').style.display ="none"

        let videos = result?.videos

        videos?.map((image)=>{

          let  imageDiv = document.createElement("iframe")

          imageDiv.setAttribute('width', '420')
          imageDiv.setAttribute('src', `https://www.youtube.com/embed/${image?.BUSINESSVIDEOLINK}`)

          imageDiv.setAttribute('class', 'video')
          imageDiv.setAttribute('height', '345')

         
      //     imageDiv.innerHTML = `
         
      //     <img
      //       src="./../images/${image?.IMAGELINK}"
            
      //       alt=""
      //       srcset=""
      //       id="img1"

      //     />

      // `

      imageMainDiv.append(imageDiv)

        })

      } else if(result.code == 201){
        imageMainDiv.innerHTML = result?.message
        document.getElementById('loader').style.display ="none"

      }else {
        imageMainDiv.innerHTML = "An Error occurred when fetching videos"
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("GET", "/get-videos/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function handleRateBtn() {
  $("#ratediv").fadeToggle();
}


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


function fetchReviews(id){

  document.getElementById('loader').style.display ="block"

  let serviceMainDiv = document.getElementById('reviewsSection')
  serviceMainDiv.innerHTML = ''

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {
        document.getElementById('loader').style.display ="none"

        let reviews = result?.reviews

        reviews?.map((review)=>{

          let  serviceDiv = document.createElement('div')

          serviceDiv.setAttribute('class', 'review')

          serviceDiv.innerHTML = `
     
            <div class="clientDetail">

              <div class="profileImg">
                <a href="/profile/${review?.USERNAME}">
                  <img
                    src="./../images/${review?.PROFILEIMAGE}"
                    alt=""
                    srcset=""
                    height="49px"
                    width="20px"
                  /></a>

              </div>

              <div class="profilename">
                <h5>${review?.USERNAME}</h5>
              </div>

            </div>

            <p>${review?.BUSINESSREVIEWS}</p>

      `

      serviceMainDiv.append(serviceDiv)

        })

      } else if(result.code == 201){
        serviceMainDiv.innerHTML =  '<p style="color: grey;">There are no comments...</p>'
        document.getElementById('loader').style.display ="none"

      }else {
        serviceMainDiv.innerHTML = `<p style="color: grey;"> An Error occurred when fetching reviews</p>`
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("GET", "/get-reviews/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function fetchRelated(id){

  document.getElementById('loader').style.display ="block"

  let serviceMainDiv = document.getElementById('relatedAppCol')

  serviceMainDiv.innerHTML = ''

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {



        document.getElementById('loader').style.display ="none"

        let related = result?.related

        related?.map((app)=>{

          let  serviceDiv = document.createElement('div')

          serviceDiv.setAttribute('class', 'relateddiv')

          serviceDiv.innerHTML = `
                 <div class="relatedname"> ${app?.BUSINESSNAME}</div>
            <a
              href="/app/${app?.BUSINESSNAME}?id=${app?.ID}&cat=${app?.BUSINESSCATEGORY}"
            ><img src="./../images/${app?.BRANDICON}" alt="" srcset="" /></a>

      `
   

      serviceMainDiv.append(serviceDiv)

        })

      } else if(result.code == 201){
        document.getElementById('loader').style.display ="none"

      }else {
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("GET", "/get-related/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}


function fetchLocations(id){

  document.getElementById('loader').style.display ="block"

  let serviceMainDiv = document.getElementById('locationAppCol')

  serviceMainDiv.innerHTML = ''

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);

      if (result.code == 200) {



        document.getElementById('loader').style.display ="none"

        let related = result?.locations

        related?.map((app)=>{

          let  serviceDiv = document.createElement('div')

          serviceDiv.setAttribute('id', 'location')

          serviceDiv.innerHTML = `

            ${app?.CONTINENT}
            ${app?.COUNTRY}
            ${app?.TOWNCITY}
            <br />
            ${app?.ADDRESS}
      `
   

      serviceMainDiv.append(serviceDiv)

        })

      } else if(result.code == 201){
        document.getElementById('loader').style.display ="none"

      }else {
        document.getElementById('loader').style.display ="none"

      }
    }else{
      // alert("Error occured...");

      //   document.getElementById('loader').style.display ="none"
    }
  };
  xhttp.open("GET", "/get-locations/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}


document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event fired. HTML is fully parsed.');

  let location = window.location.href

  if(location.includes('/app/')){


    let appid = location.substring(location.indexOf('=')+1, location.indexOf('&'))

    let catid = location.substring(location.lastIndexOf('=')+1)

    fetchReviews(appid)
    fetchLocations(appid)
    fetchRelated(catid)


  }

});

// window.addEventListener('load', function () {
//   console.log('load event fired. All resources have finished loading.');

//   document.getElementById('loader').style.display ="none"

//   let location = window.location.href

//   if(location.includes('/app/')){

    

//     let appid = location.substring(location.lastIndexOf('=')+1)

//     this.alert("fetched: " + appid)

//     fetchRelated(appid)

//   }});