
var counterService = 0;

var y = 0;


var  imgElement;
$(document).ready(function(){

    console.log('hello body readdyt')
   


$('#servicesNext').on('click', function(){

alert("Make sure to fill all fields correctly");
    $('#basicInfo').fadeOut();
    $('#servicesInfo').fadeIn();
    
});

$('#locationNext').on('click', function(){

    $('#basicInfo').fadeOut();
    $('#locationInfo').fadeIn();

});

$('#basicPrevious').on('click', function(){

   
    $('#locationInfo').fadeOut();
    $('#basicInfo').fadeIn();

});

$('#servicePrevious').on('click', function(){

    $('#locationInfo').fadeOut();
    $('#servicesInfo').fadeIn();
});

$('#galleryNext').on('click', function(){

    $('#locationInfo').fadeOut();
    $('#galleryInfo').fadeIn();
});


$('#reelNext').on('click', function(){

    $('#galleryInfo').fadeOut();
    $('#reelDiv').fadeIn();
});

$('#galleryPrevious').on('click', function(){

    $('#reelDiv').fadeOut();
    $('#galleryInfo').fadeIn();
});

$('#locationPrevious').on('click', function(){

    $('#socialMedia').fadeOut();
    $('#locationInfo').fadeIn();
});

$('#socialNext').on('click', function(){

    $('#locationInfo').fadeOut();
    $('#socialMedia').fadeIn();
});

$('#reelPrevious').on('click', function(){

    
    $('#socialMedia').fadeOut();
    $('#reelDiv').fadeIn();
});
$('#addS').on('click', function(){

    console.log($('#serviceName').val())

    counterService++;

    var sectionDiv =
      '  <form action="/saddservice" method="post" enctype="multipart/form-data"> <section class="classSection" id="section' +
      counterService +
      '"><div class="inp"><img src="./../images/businessgazzete.png.jpg" alt="" srcset="" id= "dis" ><br><br><label for="companyIcon">Service Image</label> <br><br> <input type="file" name="serviceIcon" id="serviceIcon" class="inputText" required><br><br></div><div class="inp"><label for="companyName">Service Name</label><br><br><input type="text" name="serviceName" id="serviceName" class="inputText" required></div><div class="inp"><label for="companyName">Service Description</label><br><br><input type="text" name="serviceDesc" id="" class="inputText" required></div><div class="inp"><label for="companyName">Service Price <br> Enter currency code of your country then the price</label><br><br><input type="text" name="servicePrice" id="" class="inputText" placeholder="Ksh. 0.00"></div> <div   class = "removeSer"  id="remove' +
      counterService +
      '" onclick="removeService(' +
      counterService +
      ');"><a  >Remove Service</a></div>  <div class="next" id="submit"><input type="submit" value="submit" class="btnNext"></div></section></form>';

   console.log(sectionDiv);
    $('.section').append(sectionDiv);

    y = document.getElementsByClassName('classSection').length;

    imgElement = document.getElementById('dis');


    document.getElementById('serviceIcon').addEventListener('change', handleFileChange, false);


});

var counnterLocation = 0;

$('#addL').on('click', function(){

    console.log($('#serviceName').val())

    counnterLocation++;

    var locationDiv = ' <form action="/saddlocation" method="post" enctype="multipart/form-data"><div class="branchLocation" id="branchLocation'+counnterLocation+'"><div class="inp"><label for="companyCountry">Branch Continent location</label><select name="branchContinent" id="" ><option value="Africa">Africa</option><option value="Asia">Asia</option><option value="Europe">Europe</option></select></div><div class="inp"><label for="companyCountry">Branch Country Location</label><input type="text" name="branchHQcountry" id="" class="input" required></div><div class="inp"><label for="companyCountry">Branch Town/City Location</label><input type="text" name="branchHQcity" id="" class="input" required></div><div class="inp"><label for="companyCountry">Branch Address</label><input type="text" name="branchHQaddress" id="" class="input" required></div> <div   class = "removeSer"  id="remove'+counnterLocation+'" onclick="removeLocation('+counnterLocation+');"><a  >Remove Service</a></div>  <div class="next" id="submit"><input type="submit" value="submit" class="btnNext"></div></div> </form>';

   console.log(locationDiv);
    $('.newAddedBranches').append(locationDiv);


})

var counnterImg = 0;

$('#addImg').on('click', function(){

  

    counnterImg++;


    let  imageDiv = `  <form action="/addserviceimage" method="post" enctype="multipart/form-data"><div class="imgThumb" id="img${counnterImg}"><div class="inp"><img src="./../images/businessgazzete.png.jpg" alt="" srcset=""  id="dis${counnterImg}"><br><br><label for="companyImage">Image</label><input type="file" name="img" id="inpImg${counnterImg}" class="input" accept="image/*"  required></div><div class="removeSer"  id="removeImg${counnterImg}" onclick="removeImage(${counnterImg});"><a>Remove Image</a></div> <div class="next" id="submit"><input type="submit" value="submit" class="btnNext"></div></div></form>`;

    $('.imageThumbnails').append(imageDiv);

    imgElement = document.getElementById('dis'+ counnterImg);



    document.getElementById('inpImg'+counnterImg).addEventListener('change', handleFileChange, false);

});



var counnterVid = 0;

$('#addVideo').on('click', function(){

  

    counnterVid++;


    let  reelDiv = `  <form action="/addservicevideo" method="post" enctype="multipart/form-data"><div class="newVideo" id="vid${counnterVid}">

    <div class="inp">
        <label for="companyVideo">Youtube Video Link</label>
        <input type="text" name="youtubeVideo" id="inpVid${counnterVid}" class="input" onchange="handleVideoChange(${counnterVid})" required>
    </div>

    <div class="removeSer"  id="removeVid${counnterVid}" onclick="removeVideo(${counnterVid});"><a>Remove Video</a></div>
    <div class="next" id="submit"><input type="submit" value="submit" class="btnNext"></div></div></form>`;

    $('.newVideos').append(reelDiv);


  //  document.getElementById('inpVid'+counnterVid).addEventListener('change', handleVideoChange(counnterVid), false);

});

imgElement = document.getElementById('icondis');


document.getElementById('iconInput').addEventListener('change', handleFileChange, false);

document.getElementById('postImageInput').addEventListener('change', handleFileChange, false)

});

function removeService(serviceNo){



        console.log(serviceNo + " happ");

        $('#section'+serviceNo).remove();
    
}

function removeLocation(locationNo){



    console.log(locationNo + " happ");

    $('#branchLocation'+locationNo).remove();

}

function removeImage(ImgNo){



    console.log(ImgNo + " happ");

    $('#img'+ImgNo).remove();

}

function removeVideo(vidNo){



    console.log(vidNo + " happ");

    $('#vid'+vidNo).remove();

}

function handleFileChange(e){



    if(!e.target.files.length) return imgElement.src='';


    return imgElement.src= URL.createObjectURL(e.target.files.item(0));

}

function handleVideoChange(cnt){

    if(cnt!=null || cnt!=undefined){


     alert('Video sucessfully added or changed.. ');
    }


}


function handleRecoverPassword() {
    
    alert("Are you sure this is your account")

    var recoveryemail = prompt("Enter your account's Email.\n You will receive a password change link email in your email after some few minutes...", '')

    if (recoveryemail != null && recoveryemail != undefined && recoveryemail != '') {


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    alert('Recovery Email sent...')

                } else if (result.code == 400) { 


                    alert("No account is registered with the provided account.")

                }else{


                    alert("Error Requesting password change... please try again...")
                }
            }
        };
        xhttp.open("POST", "/emailpasswordchangerequest", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("email=" + recoveryemail);
        
    } else {
        alert("No email was received...")
    }
}