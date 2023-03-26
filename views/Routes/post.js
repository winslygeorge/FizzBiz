const  express = require('express')
const { fstat } = require('fs')
const route = express.Router()

const path = require('path')

const fs = require('fs')

const bycrypt = require('bcrypt')

const oracledb  =  require('oracledb')

const clean = require('../databasemanagementMYSQL/clean')

const formidable =require('formidable')


const db = require('../databasemanagementMYSQL/DBManager')
const DBcon = new db()

const handleDbReq = require('./../../oracleDBManager/dbmanager')
const dbconnect = require('../../oracleDBManager/dbconnect')

const serveRequest = new handleDbReq()


const genEmail =  require('./../../email/genSendEmail')
const optionGen =  require('./../../email/emailoptionsgenerator')
const options =  new optionGen()


const gen = new  genEmail()

route.post('/add/user',   (req, res)=>{

var form = new formidable.IncomingForm()
form.parse(req, function(err, fields, files){



    var newUser = {

        profileImage : clean.CleanData(new String(files.profileImage.name)),
        firstname : clean.CleanData(new String(fields.firstName)),
        lastname : clean.CleanData(new String(fields.lastName)),
        username : clean.CleanData(new String(fields.userName)),
        DOB : new Date(fields.age),
        email : clean.CleanData(new String(fields.userEmail)),
        conEmail : clean.CleanData(new String(fields.conUserEmail)),
        continent : clean.CleanData(new String(fields.continent)),
        country : clean.CleanData(new String(fields.country)),
        townCity : clean.CleanData(new String(fields.city)),
        address : clean.CleanData(new String(fields.address)),
        mobileTel : clean.CleanData(new String(fields.telno)),
        workTel : clean.CleanData(new String(fields.worktelno)),
        facebook : clean.CleanData(new String(fields.facebook)),
    instagram : clean.CleanData(new String(fields.instagram)),
    linkedln : clean.CleanData(new String(fields.linkedln)),
    twitter : clean.CleanData(new String(fields.twitter)),
    youtube : clean.CleanData(new String(fields.youtubelink)),
    github : clean.CleanData(new String(fields.github)),
    password : clean.CleanData(new String(fields.password)),
    conpasswd : clean.CleanData(new String(fields.conUserPasswd))
    }

    var fname, lname, uname, email, mobTel, youtube, continent, country, town, dob, address, passwd, profileImg , facebook, instagram, twitter, linkedln, github= null;

    var wokTel = null
    var fnameErr, lnameErr, unameErr, emailErr,conemailErr, mobTelErr, wokTelErr, continentErr, countryErr, townErr, dobErr, addressErr, passwdErr, conpasswdErr, profileImgErr = null;

//first Name Validation

    if(newUser.firstname.match(/^[a-zA-Z\s]+$/)){

       fname = newUser.firstname;
    }else{

    fnameErr = "required to be letters and space only";
    }

    //last Name Validation

 if(newUser.lastname.match(/^[a-zA-Z\s]+$/)){

lname = newUser.lastname;

        }else{

            lnameErr = "required to be letters and space only"

        }



    //User Name Validation


    if(newUser.username.match(/^[a-zA-Z0-9\s]+$/)){

uname = newUser.username
               

    }else{

        unameErr = "required letters and numbers only, no space"
    }

    //work tel input validation

    if(newUser.workTel.match(/^[+]?[0-9]{1,3}?[0-9]{3}?[0-9]{4,6}/) && newUser.workTel.length >= 9 && newUser.workTel.length <= 14){


        wokTel = newUser.workTel

    }else{

       

        wokTelErr = "Expected  numbers and + only or you entered an invalid number "

    }

    // mobile tel validation

    if(newUser.mobileTel.match(/^[+]?[0-9]{1,3}?[0-9]{3}?[0-9]{4,6}/) && newUser.mobileTel.length >= 9 && newUser.mobileTel.length <= 14){

               mobTel = newUser.mobileTel       

    }else{

         
        mobTelErr = "Expected  numbers and + only or you entered an invalid number"
    }

// location continet country town validation

if(newUser.continent.match(/^[a-zA-Z0-9\s]+$/)&& newUser.country.match(/^[a-zA-Z0-9\s]+$/)&&newUser.townCity.match(/^[a-zA-Z0-9\s]+$/)){

                       continent = newUser.continent
                       country = newUser.country
                       town = newUser.townCity
}else{

    continentErr = "Expected letters space and numbers only on location"
}

// Email validation

if(newUser.email.match(newUser.conEmail)){

                 email= newUser.email   

}else{

    emailErr = "Email and confirm email do not match"

}

//password Validation

if(newUser.password.match(newUser.conpasswd)){

    if(newUser.password.match(/^.*(?=.{6})(?=.*[0-9])(?=.*[A-Z]).*$/)){

     passwd = bycrypt.hashSync(newUser.password,  bycrypt.genSaltSync(10) )
   
        

    }else{

passwdErr = "Password must contain at least one capital letter , one digital number and \n it must be at least six characters "
    }

}else{

passwdErr= "Password do not match"
}

//profileImage Validation

   

  if(  handleImageUpload(files)){



    profileImg = files.profileImage.name

  }else{

    profileImgErr = "invalid image type \n Expected .png, .jpg, .jpeg" 
  }

//dob social media validation

if(newUser.facebook != null || !newUser.facebook.match('') || newUser.facebook != undefined){

    facebook = newUser.facebook
}

if(newUser.instagram != null || !newUser.instagram.match('') || newUser.instagram != undefined){

    instagram = newUser.instagram
}

if(newUser.twitter != null || !newUser.twitter.match('') || newUser.twitter != undefined){

    twitter = newUser.twitter
}

if(newUser.linkedln != null || !newUser.linkedln.match('') || newUser.linkedln != undefined){

    linkedln = newUser.linkedln
}

if(newUser.github != null || !newUser.github.match('') || newUser.github != undefined){

    github = newUser.github
}

if(newUser.youtube != null || !newUser.youtube.match('') || newUser.youtube != undefined){

    youtube = newUser.youtube
}
//date validation



dob =  newUser.DOB



//address validation

address = newUser.address

//submit validation

if(fname!=null && lname!=null && uname!=null && email!=null && mobTel !=null  && passwd !=null && dob !=null && profileImg !=null ){


  
var profileIg = uname+'_'+Date.now()+'_'+Math.round(Math.random()* 1E9)+'.'+profileImg.split('.')[1]
    var inputs = {


        username : uname,
        firstname : fname,
        lastname : lname,
        email : email,
        password : passwd,
        mobileTel : mobTel,
        workTel : wokTel,
        profileImage :profileIg,
        continent : "",
        country : "",
        townCity : "",
        address : "",
        DOB : dob,
        facebook : facebook,
        instagram : instagram,
        linkedln : linkedln,
    twitter : twitter,
    youtube : youtube,
    github : github,
   
    agreedtoterms : "true",
    isverified : 0,
    
    
        tablename: "USERS",
        operation : "insert"

    }
  
 console.log(inputs)
    serveRequest.run(inputs).then(function(feedback){

        console.log(feedback.result)
        if(feedback.code == 200){

            var oldPath = files.profileImage.path

            var newPath = path.join(__dirname, './../images') +'/'+profileIg        
            console.log(newPath)
            var rawData = fs.readFileSync(oldPath)
        
            fs.writeFileSync(newPath, rawData, function(err){
        
                if(err){
        
                    console.log(err)
                }else{
        
                    console.log('image uploaded successfully')
                }
            })
            console.log(feedback.result)

            var code = Math.round(Math.random()* 10000)

            var insertVerification  =  {
                tablename : 'verificationcode',
                operation : 'insert',
                username : inputs.username,
                code : code
            }

            serveRequest.run(insertVerification).then(function(results){

                if(results.code  == 200 ){


                     var email = {
                       from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                       to: inputs.email,
                       subject: "Welcome to Fizzbiznet",
                       template: "welcome",
                       context: {
                         name: inputs.username,

                         title: "Welcome Email",
                       },

                       attachments: [
                         {
                           filename: "FizzBizNet.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/FizzBizNet.png"
                           ),
                           cid: "logoimg", //same cid value as in the html img src
                         },
                         {
                           filename: "featured-area-top.jpg",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/featured-area-top.jpg"
                           ),
                           cid: "areatopid", //same cid value as in the html img src
                         },
                         {
                           filename:
                             "hunters-race-MYbhN8KaaEc-unsplash (1).jpg",
                           path: path.join(
                             __dirname,
                             "./../images/hunters-race-MYbhN8KaaEc-unsplash (1).jpg"
                           ),
                           cid: "huntersid", //same cid value as in the html img src
                         },
                         {
                           filename:
                             "Betting-Business-Scientific-Games-2018-Notes-Redemption-696x465.jpg",
                           path: path.join(
                             __dirname,
                             "./../images/Betting-Business-Scientific-Games-2018-Notes-Redemption-696x465.jpg"
                           ),
                           cid: "betbiz", //same cid value as in the html img src
                         },
                         {
                           filename: "image-02.jpg",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/image-02.jpg"
                           ),
                           cid: "img02", //same cid value as in the html img src
                         },
                         {
                           filename: "image-03.jpg",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/image-03.jpg"
                           ),
                           cid: "img03", //same cid value as in the html img src
                         },
                         {
                           filename: "icon-01.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/icon-01.png"
                           ),
                           cid: "icon01", //same cid value as in the html img src
                         },
                         {
                           filename: "icon-02.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/icon-02.png"
                           ),
                           cid: "icon02", //same cid value as in the html img src
                         },
                         {
                           filename: "icon-03.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/icon-03.png"
                           ),
                           cid: "icon03", //same cid value as in the html img src
                         },
                         {
                           filename: "image-04.jpg",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/image-04.jpg"
                           ),
                           cid: "img04", //same cid value as in the html img src
                         },
                         {
                           filename: "facebook2x.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/facebook2x.png"
                           ),
                           cid: "facebookid", //same cid value as in the html img src
                         },
                         {
                           filename: "instagram2x.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/instagram2x.png"
                           ),
                           cid: "instagramid", //same cid value as in the html img src
                         },
                         {
                           filename: "twitter2x.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/twitter2x.png"
                           ),
                           cid: "twitterid", //same cid value as in the html img src
                         },
                         {
                           filename: "linkedin2x.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/linkedin2x.png"
                           ),
                           cid: "linkedlnid", //same cid value as in the html img src
                         },
                         {
                           filename: "bee.png",
                           path: path.join(
                             __dirname,
                             "./../../email/views/images/bee.png"
                           ),
                           cid: "beeid", //same cid value as in the html img src
                         },
                       ],
                     };

                     gen
                       .sendMail(
                         options.generateEmailOpt(
                           email.from,
                           email.to,
                           email.subject,
                           email.template,
                           email.context,
                           email.attachments
                         )
                       )
                       .then(
                         function (result) {
                           console.log(result);

                          
                         },
                         function (error) {
                           console.log(error);
                         
                         }
                       );

                    setTimeout(function(){


                         var email = {
                           from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                           to: inputs.email,
                           subject: "Verify Your Email",
                           template: "verify",
                           context: {
                             name: inputs.username,
                             url: "YOUR URL",
                             title: "Verify Email",
                             code: code,
                           },

                           attachments: [
                             {
                               filename: "FizzBizNet.png",
                               path: path.join(
                                 __dirname,
                                 "./../../email/views/images/FizzBizNet.png"
                               ),
                               cid: "logoimg", //same cid value as in the html img src
                             },
                             {
                               filename: inputs.profileImage,
                               path: path.join(
                                 __dirname,
                                 "./../images/" + inputs.profileImage
                               ),
                               cid: "profileicon", //same cid value as in the html img src
                             },
                           ],
                         };

                         gen
                           .sendMail(
                             options.generateEmailOpt(
                               email.from,
                               email.to,
                               email.subject,
                               email.template,
                               email.context,
                               email.attachments
                             )
                           )
                           .then(
                             function (result) {
                                   console.log(result);
                                   
  res.redirect("/emailverification");                             },
                             function (error) {
                                 console.log(error);
                                   res.redirect("/emailverification");
                             }
                           );


                    }, 3000)

                   
                    
                    
    
                    
        
        
                }else{

                    res.redirect('/emailverification')


                }

            })


           
        }else{

            res.render('Register/index', {error : "Username or Email already Exists",profileError: profileImgErr,fnErr: fnameErr, lnErr: lnameErr, unErr: unameErr, emErr: emailErr, contErr: continentErr, passErr: passwdErr, wokrTelErr: wokTelErr, mobileErr: mobTelErr, firstName: fname, lastName: lname, userName: uname, email: email, confimEmail: confirmEmail, country: country, continent: continent, townCity: town, address: newUser.address, wokyTel: wokTel, mobyTel: mobTel , profileImage: profileImg})
        }


   
    })

   

}else{

    var confirmEmail= newUser.conEmail;

    console.log(fname+" : "+lname+" : "+uname+" : "+email+" : "+wokTel+" : "+continent+" : "+country+" : "+town+" : "+address+" : "+passwd+" : "+dob+" : "+profileImg);
res.render('Register/index', {profileError: profileImgErr,fnErr: fnameErr, lnErr: lnameErr, unErr: unameErr, emErr: emailErr, contErr: continentErr, passErr: passwdErr, wokrTelErr: wokTelErr, mobileErr: mobTelErr, firstName: fname, lastName: lname, userName: uname, email: email, confimEmail: confirmEmail, country: country, continent: continent, townCity: town, address: newUser.address, wokyTel: wokTel, mobyTel: mobTel , profileImage: profileImg})
}

})

})


route.post('/verifyemail', (req, res)=>{

var codeVer = {

    code : parseInt(clean.CleanData(req.body.code)),
    username : clean.CleanData(req.body.username)
}

if(codeVer.code != null && codeVer.code != undefined && codeVer.username != null && codeVer.username != undefined){


    var selectUser = {

        operation : 'select',
        tablename : 'verificationcode',
        fields : [],
        wfield : ['username'],
        wvalue : [codeVer.username]
    }

    serveRequest.run(selectUser).then(function(results){

        if(results.code == 200){

            var storedcode = results.result.rows[0].CODE

            if(storedcode == codeVer.code){

              var updatever = {

                operation : 'update',
                tablename : 'users',
                isverified : 1,
                where : 'username',
                val : codeVer.username
              }

              serveRequest.run(updatever).then(function(results){

                if(results.code == 200){


                    var deleteever = {

                        operation : 'update',
                        tablename : 'users',
                        isverified : 1,
                        where : 'username',
                        val : codeVer.username
                      }

                      serveRequest.run(deleteever).then(function(results){

                        res.redirect('/login')

                      })


                }else{

                    res.render('verifyemail/index', {codeerr : "Wrong code could not verify...try again"})

                }
              })


            }else{

                res.render('verifyemail/index', {codeerr : "Wrong code ... could not verify...try again"})

            }

        }else{

            res.render('verifyemail/index', {codeerr : "User does not exist..."})


        }
    })

}else{

  res.render('verifyemail/index', {codeerr : "Fields empty"})
}
    


})



function handleImageUpload(files){
        if(!files.profileImage){
    
            return false;
        }else{
    
            
            let ext = files.profileImage.name.split('.')[1].toLowerCase();

            if(ext.match( 'png') || ext.match('jpg')|| ext.match('jpeg')){

                     return true;

            }else{

                return false;
            }

        }
}


route.post('/dbchangepass', (req, res) => {
    
    var useremail = clean.CleanData(req.body.email)

    var password = clean.CleanData(req.body.password)

    var passwd, passwdErr = null


    var conpassword = clean.CleanData(req.body.conPassword)

    if (useremail != null && useremail != undefined && password != null && password != undefined && conpassword != null && conpassword != undefined) {
        
        if (password.match(conpassword)) {

            if (password.match(/^.*(?=.{6})(?=.*[0-9])(?=.*[A-Z]).*$/)) {

                passwd = bycrypt.hashSync(password, bycrypt.genSaltSync(10))



            } else {

                passwdErr = "Password must contain at least one capital letter , one digital number and \n it must be at least six characters "
            }

        } else {

            passwdErr = "Password do not match"
        }

        var updatepassword = {
            
            operation: 'update',
            tablename: 'users',
            password: passwd,
            where: 'email',
            val : useremail
        }

        if (updatepassword.password != null && updatepassword.password != undefined) {
            
            serveRequest.run(updatepassword).then(function (results) {

                if (results.code == 200) {

                    res.redirect('/login')
                } else {

                    res.render('passwordchange/index', { requesterEmail: useremail })

                }
            })


        } else {
            
            res.render('passwordchange/index', { requesterEmail: useremail, error : passwdErr })


        }

       

    } else {
        
        res.render('passwordchange/index', { requesterEmail: useremail })
    }
})


route.post('/fizzbizpostcomment', (req, res)=>{

  var comment = {

    username: clean.CleanData(req.body.name),
  
    useremail: clean.CleanData(req.body.email),
    
    message : clean.CleanData(req.body.message),
  }

  if (comment.useremail != null && comment.useremail != undefined && comment.username != null && comment.username != undefined && comment.message != null && comment.message != undefined) {
    

    var email = {
      from: `${comment.username}  <fizzbiznet@gmail.com>`,
      to: 'fizzbiznet@gmail.com',
      subject: 'Comment for Fizzbiznet',
      template: "comment",
      context: {
        name: comment.username,

        appname: 'Fizzbiznet',

        replyto: comment.useremail,

        content: comment.message,

        title: "Comment page",
      },

      attachments: [
        {
          filename: "FizzBizNet.png",
          path: path.join(
            __dirname,
            "./../../email/views/images/FizzBizNet.png"
          ),
          cid: "logoimg", //same cid value as in the html img src
        },
      ],
    };

    gen
      .sendMail(
        options.generateEmailOpt(
          email.from,
          email.to,
          email.subject,
          email.template,
          email.context,
          email.attachments
        )
      )
      .then(
        function (result) {
          console.log(result);
          res.render('home/index', {emailsuc : "Email was sent successfully"})
        },
        function (error) {
          console.log(error);
          res.render('home/index', { emailsuc: "Error sending email .. Please try again" })

        }
      );

  } else {
    
    res.render('home/index', {emailerr : 'Please try again...'})
  }
})

route.post("/agreetoterms", (req, res)=>{

  res.redirect('/Register')
});


module.exports = route;