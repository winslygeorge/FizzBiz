const express = require("express");

const formidable = require("formidable");

const dateDiff = require('date-diff')

const clean = require("./../databasemanagementMYSQL/clean");

const db = require("./../../oracleDBManager/dbmanager");

const genEmail = require("./../../email/genSendEmail");
const optionGen = require("./../../email/emailoptionsgenerator");
const options = new optionGen();

const gen = new genEmail();

const path = require("path");

const fs = require("fs");
const { cleanData } = require("jquery");
const { time } = require("console");

const dbcon = new db();

const route = express.Router();

const isbizSet = (req, res, next) => {
  if (
    req.session.appid != null &&
    req.session.appid != undefined &&
    req.session.isAuth
  ) {
    next();
  } else {
    res.redirect("/AddService");
  }
};

const isAppID = (req, res, next) => {
  if (req.session.appid != null && req.session.appid != undefined) {
    next();
  } else {
    res.redirect("/AddService");
  }
};

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

route.get('/suscription/page', isAuth, (req, res)=>{

    res.render('suscriptionPage/index')
    
})

route.get("/termsandconditions", (req, res) =>{

  res.render('termsandconditions/terms')
})

route.post("/post/discussion", isAuth, (req, res) => {
  var commment = {
    id: new Date() * Math.round(Math.random() * 30),

    businessreviews: clean.CleanData(req.body.comment),

    username: clean.CleanData(req.body.username),

    businessappid: parseInt(req.body.appid),

    profileimage: clean.CleanData(req.body.profileimage),

    tablename: "businessreviews",

    operation: "insert",
  };

  if (
    commment.id != null &&
    commment.id != undefined &&
    commment.businessappid != null &&
    commment.businessappid != undefined &&
    commment.username != null &&
    commment.username != undefined &&
    commment.businessreviews != null &&
    commment.businessreviews != undefined &&
    commment.businessreviews != ""
  ) {
    dbcon.run(commment).then(function (results) {
      if (results && results.code == 200) {
        var commentquery = {
          tablename: "businessreviews",
          operation: "select",

          fields: [],

          wfield: ["businessappid"],

          wvalue: [commment.businessappid],
        };

        dbcon.run(commentquery).then(function (results) {
          if (results && results.code == 200) {
            res.send({ code: 200, result: results.result.rows });
          } else {
            console.log(results.result);

            res.send({ code: 101, result: "There are no comment..." });
          }
        });
      } else {
        console.log(results.result);

        res.send({ code: 101, result: "please try again..." });
      }
    });
  } else {
    res.send({ code: 101, result: "please try again..." });
  }
});


route.post('/post/disc', isAuth, (req, res)=>{

  var disc = {
    id: new Date() * Math.random()* 1000,
    
    username : req.body.username,

    subject : clean.CleanData(req.body.subject),

    content : clean.CleanData(req.body.content),

    userimage : req.body.userimage,
     time : new Date(),

     category : "main",

     competition_name: req.body.competition_name,

     tablename: "discussion",

     operation : "insert"
  }

  dbcon.run(disc).then((feedback)=>{

    if(feedback && feedback.code == 200){

      res.send({code : 200})
    }else{

      res.send({code : 101})
    }

  })

})

route.get('/competition/discussions', (req, res)=>{


  var discArray = []

  var discs = {

    tablename:"discussion",
    operation:"select",
    fields : [],
    wfield: ["competition_name"],
    wvalue: ["young hustle competition"],
    orderBy: 'id',
    orderByDirection : 'DESC'
  }


  dbcon.run(discs).then(async(feedback)=>{
    var discDate = null

    if(feedback && feedback.code == 200){

      var result = feedback.result.rows

      if(result.length > 0){

      


       await result.map( async discc => {

          discDate = discc.TIME
          var discReplies = {

            tablename:"discussionsubs",
            operation:"select",
            fields : [],
            wfield: ["disc_id"],
            wvalue:[discc.ID]
          }
        
          var repliesCount = 0;
          
        
        await  dbcon.run(discReplies).then((feedback)=>{
        
        
            if(feedback && feedback.code == 200){
        
             repliesCount = feedback.result.rows.length;

             console.log("rep counts :", repliesCount)
        
            }
          })
  

          const startDate = discDate
const endDate = new Date()
const duration = getDuration(startDate, endDate);
console.log(duration); // Output: "1 years, 9 months, 3 weeks, 4 days, 0 hours, 0 minutes, 0 seconds"

          // var diff =  Math.abs(new Date().getTime() - discDate.getTime())
          // var year = Math.ceil(diff / (1000 * 3600 * 24 * 30 * 12))
          // var months = Math.ceil(diff / (1000 * 3600 * 24 * 30))
          // var weeks = Math.ceil(diff / (1000 * 3600 * 24 *7))
          // var days = Math.ceil(diff / (1000 * 3600 * 24))
          // var hours = Math.ceil(diff / (1000 * 3600))
          // var minutes = Math.ceil(diff / (1000 * 60))
          // var seconds = Math.ceil(diff / (1000))

          // if(months >= 12 ){

          //   timeDisc = year + " years "
          // }else if(days >= 30){

          //   timeDisc = months + " months "
          // }else if(days >= 7){

          //   timeDisc = weeks + " weeks "
          // }else if(hours >= 24){

          //   timeDisc = days + " days "
          // }else if(minutes >= 60){

          //   timeDisc = hours + " hours"
          // }else if(seconds >= 60){

          //   timeDisc = minutes + " minutes"
          // }else{
          //   timeDisc = seconds + " seconds "
          // }

          discc.age = duration
          discc.replies = repliesCount;

          console.log(repliesCount)


          // console.log(" sec :"+ seconds + " min : " + minutes + " hours : "+ hours +" days : "+ days + " months : "+ months+ " years : "+ year)

          discArray.push(discc)
          
        });

        ///...../>


        
        //<........................./>
  if(req.session.userDetails != null || req.session.userDetails != undefined){

    var username = req.session.userDetails.username

    var userimage = req.session.userDetails.profileimage

    var user = {
      username : username,
      userimage : userimage
    }

    setTimeout(() => {
          res.render("DiscForum/index", {user : user, isLoggedin: req.session.userDetails.username, discussions: discArray})

    }, 3000)

  } else {
    
      setTimeout(() => {
    res.render("DiscForum/index", {discussions: discArray})

    }, 3000)


  }

      } else {
        
        
           setTimeout(() => {
        res.render("DiscForum/index", {user : user, isLoggedin: req.session.userDetails.username, discussions: discArray})

    }, 3000)


      }

    } else {
      
         setTimeout(() => {
      res.render("DiscForum/index", {user : user, isLoggedin: req.session.userDetails.username, discussions: discArray})

    }, 3000)


    }

  })




})

//...................GET SUB DISCUSSIONS......................../>


route.get('/competition/discussions_subs', (req, res)=>{


    var discDate = null

          var discReplies = {

            tablename:"discussionsubs",
            operation:"select",
            fields : [],
            wfield: ["disc_id"],
            wvalue: [req.query.disc_id],
             orderBy: 'time',
    orderByDirection : 'DESC'
          }
              
        
          dbcon.run(discReplies).then(async(feedback)=>{
        
        
            if(feedback && feedback.code == 200){
              var subs = feedback.result.rows;
        
             var  repliesCount = feedback.result.rows.length;

             if(repliesCount > 0){

              
              subs.forEach(element => {

                var timeDisc = null;
                
                discDate = element.TIME

                  const startDate = discDate
const endDate = new Date()
const duration = getDuration(startDate, endDate);
console.log(duration);
                // var diff =  Math.abs(new Date().getTime() - discDate.getTime())
                // var year = Math.ceil(diff / (1000 * 3600 * 24 * 30 * 12))
                // var months = Math.ceil(diff / (1000 * 3600 * 24 * 30))
                // var days = Math.ceil(diff / (1000 * 3600 * 24 *7))
                // var days = Math.ceil(diff / (1000 * 3600 * 24))
                // var hours = Math.ceil(diff / (1000 * 3600))
                // var minutes = Math.ceil(diff / (1000 * 60))
                // var seconds = Math.ceil(diff / (1000))
      
                // if(months >= 12 ){
      
                //   timeDisc = year + " years "
                // }else if(days >= 30){
      
                //   timeDisc = months + " months "
                // }else if(days >= 7){
      
                //   timeDisc = weeks + " weeks "
                // }else if(hours >= 24){
      
                //   timeDisc = days + " days "
                // }else if(minutes >= 60){
      
                //   timeDisc = hours + " hours"
                // }else if(seconds >= 60){
      
                //   timeDisc = minutes + " minutes"
                // }else{
                //   timeDisc = seconds + " seconds "
                // }
      
                element.age = duration
                element.replies = repliesCount
    
              });
               
                     setTimeout(() => {
              res.send({code: 200, subDisc : subs})

    }, 3000)


             }else{

              res.send({code : 101})
             }

             
        
            }
          })
  
         
      

        ///...../>


        
        //<........................./>
  

})

//.................../>


route.post('/post/discsubs', isAuth, (req, res)=>{

  var disc = {
    id: new Date() * Math.random()* 1000,

    disc_id : parseFloat(req.body.discmain_id),

    content : clean.CleanData(req.body.comment),
    
    username : req.session.userDetails.username,

    userimage : req.session.userDetails.profileimage,

     time : new Date(),

     tablename: "discussionsubs",

     operation : "insert"
  }

  dbcon.run(disc).then((feedback)=>{

    if(feedback && feedback.code == 200){

      res.send({code : 200, subss : disc})
    }else{

      console.log(feedback.result)
      res.send({code : 101})
    }

  })

})

route.get('/friends/:username', (req, res)=>{

  var getFriends = {

    operation:"select",
    tablename: "friends",

    fields : [],

    wfield : ["username"],

    wvalue : [req.params.username]
  }

  dbcon.run(getFriends).then((feedback)=>{

    if(feedback &&  feedback.code == 200){

      var results = feedback.result.rows
      if(results.length > 0){

        res.render('followers/index', {loggedUser : req.session.userDetails, friends : results})

      }else{

        res.render('followers/index')
      }
    }
  })
})



route.post('/post/friendRequest', isAuth, (req, res)=>{


  var fr = {

    operation:'insert',
    tablename : "friendrequests",
    id : new Date() * Math.random()*1000,
    sender : req.session.userDetails.username,
    receiver : req.body.receivername,
    userimage : req.body.receiverimage,
    created_at : new Date()
  }

  dbcon.run(fr).then((feedback)=>{

    if(feedback && feedback.code == 200){

      res.send({code : 200})
    }else{

      console.log(feedback.result)
      res.send({code: 101})
    }
  })

})


route.post('/post/acceptfriendRequest', isAuth, (req, res)=>{


  var fr = {

    operation:'insert',
    tablename : "friends",
    id : new Date() * Math.random()*1000,
    username : req.session.userDetails.username,
    friend : req.body.receivername,
    userimage : req.body.receiverimage,
    created_at : new Date()
  }

  dbcon.run(fr).then((feedback)=>{

    if(feedback && feedback.code == 200){

      var df = {

        operation : "delete",
        tablename : "friendrequests",
        wfield : 'id',
        wvalue : req.body.requestid
      }

      dbcon.run(df).then((feedback)=>{

        if(feedback && feedback.code == 200){

          res.send({code : 200})

        }else{

          console.log(feedback.result)

          res.send({code: 101})
        }
      })

      
    }else{

      console.log(feedback.result)
      res.send({code: 101})
    }
  })

})


route.post('/post/cancelfriend', isAuth, (req, res)=>{

  var deleteFriend = {

    operation: 'delete',
    tablename : 'friends',
    wfield : 'id',
    wvalue : req.body.friend_id
  }

  dbcon.run(deleteFriend).then((feedback) => {

    if(feedback && feedback.code == 200){

      res.send({code : 200})
    }else{

      console.log(feedback.result)

      res.send({code : 101})
    }
  })

})


route.get('/friendlist/:user', isAuth, (req, res)=>{
var friendList = []

var crossFriendsList = []
  var selectFriends = {
    operation: 'select',
    tablename : 'friends',
    fields : [],
    wfield : ['username'],
    wvalue :[req.params.user]
  }

  dbcon.run(selectFriends).then((feedback)=>{

    if(feedback && 
      feedback.code == 200){

      if(feedback.result.rows.length > 0){

        friendList = feedback.result.rows

      }

      var crossFriends = {

        operation : 'select',
        tablename : 'friends',
        fields : [],
        wfield : ['friend'],
        wvalue : [req.params.user]
      }

      dbcon.run(crossFriends).then((feedback)=>{

        if(feedback && feedback.code == 200){

          if(feedback.result.rows.length > 0){

            crossFriendsList = feedback.result.rows

            


            res.render('followers/index', {mefriend: friendList, hefriend: crossFriendsList, loggedUser: req.session.userDetails})
          }else{

            res.render('followers/index', {mefriend: friendList, hefriend: crossFriendsList, loggedUser: req.session.userDetails})
          }
        }else{

          

          res.render('followers/index', {mefriend: friendList, hefriend: crossFriendsList})
        }
      })
    }else{


      res.render('followers/index', {mefriend: friendList, hefriend: crossFriendsList})
    }
  })
})


function getDuration(startDate, endDate) {
  // Calculate the duration in milliseconds
  const durationInMilliseconds = endDate - startDate;

  // Calculate years and months
  const years = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

  // Calculate weeks and days
  const weeks = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24 * 7))
  const days = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24 * 7) / (1000 * 60 * 60 * 24)));

  // Calculate hours, minutes, and seconds
  const hours = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
  const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60) / (1000 * 60)));
  const seconds = Math.floor((durationInMilliseconds % (1000 * 60) / 1000));

  let durationString = ''

  if (years !== 0) {
   
    durationString = ` ${years} years `;
  } else if (months !== 0) {
    durationString = ` ${months} months `;

  } else if (weeks !== 0) {
    
    durationString = ` ${weeks} weeks `;

  } else if (days !== 0) {
      durationString = ` ${days} days `;

  } else if (hours !== 0) {
    
      durationString = ` ${hours} hours `;

  } else if (minutes) {
    
      durationString = ` ${minutes} minutes `;

  } else if (seconds !== 0) {
    
      durationString = ` ${seconds} seconds `;

  } else {
    
    durationString = ` just now `
  }

  // Create a formatted string

  return durationString;
}



// var sus = req.query.sus

//     if(sus != "" ||sus != null || sus != undefined || sus != "undefined"){

//         res.render('/suscription/Page', {sus : sus})
//     }

module.exports = route