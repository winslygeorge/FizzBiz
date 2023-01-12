

function handleremoveservice(SERVICEID) {
    
    alert(SERVICEID)

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {


                    alert('service was successfully removed...')
                    document.getElementById('id' + SERVICEID).remove()

                } else {


                    alert("Error deleting service... please try again...")
                }
            }
        };
        xhttp.open("POST", "/deleteappservice", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("serviceid=" + SERVICEID);
    }


function handleremoveimage(id) {



    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result = JSON.parse(this.responseText)

            if (result.code == 200) {


                alert('Image was successfully removed...')
                document.getElementById('id' + id).remove()

            } else {


                alert("Error deleting Image... please try again...")
            }
        }
    };
    xhttp.open("POST", "/deleteappimage", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + id);
}

function handleremovevideo(id) {



    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result = JSON.parse(this.responseText)

            if (result.code == 200) {


                alert('Video was successfully removed...')
                document.getElementById('id' + id).remove()

            } else {


                alert("Error deleting video... please try again...")
            }
        }
    };
    xhttp.open("POST", "/deleteappvideo", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + id);
}


function handleremovelocation(id) {



    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result = JSON.parse(this.responseText)

            if (result.code == 200) {


                alert('Location was successfully removed...')
                document.getElementById('id' + id).remove()

            } else {


                alert("Error deleting location... please try again...")
            }
        }
    };
    xhttp.open("POST", "/deleteapplocation", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + id);
}


function updateAppname(id){

    var appname = prompt("Enter new app name? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appname').innerText = result.result

                } else {


                    alert("Error changing app name... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updateappname", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&appname=" + appname);

    } else {
        
        alert("No changes was received")
    }

   
}


function updateAppTopic(id) {

    var appname = prompt("Enter new Topic ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('apptopic').innerText = result.result

                } else {


                    alert("Error changing Topic... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updatetopic", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&topic=" + appname);

    } else {

        alert("No changes was received")
    }


}

function updateAppContinent(id) {

    var appname = prompt("Enter new Continent ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appcontinent').innerText = result.result

                } else {


                    alert("Error changing Continent... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updatecontinent", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&continent=" + appname);

    } else {

        alert("No changes was received")
    }


}


function updateAppCountry(id) {

    var appname = prompt("Enter new Country ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appcountry').innerText = result.result

                } else {


                    alert("Error changing Country... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updatecountry", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&country=" + appname);

    } else {

        alert("No changes was received")
    }


}


function updateAppTown(id) {

    var appname = prompt("Enter new Town/City ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('apptown').innerText = result.result

                } else {


                    alert("Error changing Town/city... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updatetown", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&town=" + appname);

    } else {

        alert("No changes was received")
    }


}

function updateAppAddress(id) {

    var appname = prompt("Enter new Address ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appaddress').innerText = result.result

                } else {


                    alert("Error changing Address... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updateaddress", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&address=" + appname);

    } else {

        alert("No changes was received")
    }


}



function updateAppFacebook(id) {

    var appname = prompt("Enter new Facebook link ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appfacebook').innerText = result.result

                } else {


                    alert("Error changing Facebook link... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updatefacebook", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&facebook=" + appname);

    } else {

        alert("No changes was received")
    }


}


function updateAppInstagram(id) {

    var appname = prompt("Enter new Instagram Link ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appinstagram').innerText = result.result

                } else {


                    alert("Error changing Instagram... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updateinstagram", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&instagram=" + appname);

    } else {

        alert("No changes was received")
    }


}

function updateAppTwitter(id) {

    var appname = prompt("Enter new Twitter ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('apptwitter').innerText = result.result

                } else {


                    alert("Error changing Twitter... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updatetwitter", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&twitter=" + appname);

    } else {

        alert("No changes was received")
    }


}


function updateAppYoutube(id) {

    var appname = prompt("Enter new Youtube ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appyoutube').innerText = result.result

                } else {


                    alert("Error changing Youtube... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updateyoutube", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&youtube=" + appname);

    } else {

        alert("No changes was received")
    }


}


function updateAppGithub(id) {

    var appname = prompt("Enter new Github Link  ? ", null)

    if (appname != undefined && appname != null && !appname.match("null") && appname != '') {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var result = JSON.parse(this.responseText)

                if (result.code == 200) {

                    document.getElementById('appgithub').innerText = result.result

                } else {


                    alert("Error changing Github... please try again...")
                }
            }
        };
        xhttp.open("POST", "/updategithub", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&github=" + appname);

    } else {

        alert("No changes was received")
    }


}