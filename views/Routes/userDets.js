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
const { clearInterval } = require("timers");

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


route.get('/user/gallery/:id', isAuth, async (req, res)=>{

  var userImages = []

    var selectUserImage = {

        operation:'select',
        tablename : 'userimages',
        fields : [],
        wfield : ['username'],
        wvalue : [req.params.id]
    }

    await dbcon.run(selectUserImage).then(async (feedback)=>{

        if(feedback.code == 200){

            var images = await feedback.result.rows

            if(images.length > 0){

       await images.forEach(async image => {
                

            var selectComments = {

                operation :'select',
                tablename : 'userimagecomments',
                fields : [],
                wfield : ['imageid'],
                wvalue : [image.ID],
            }

         await dbcon.run(selectComments).then(async (feedback)=>{

                if(feedback.code == 200){

                    var commentsCount =  await feedback.result.rows.length



                    image.comments = commentsCount

                    var imagelikes = {

                        operation : 'select',
                        tablename : 'userimagelikes',
                        fields : [],
                        wfield : ['imageid'],
                        wvalue : [image.ID]
                    }

                  await dbcon.run(imagelikes).then(async (feedback)=>{

                        if(feedback.code == 200){

                            var likesCount = await feedback.result.rows.length

                            image.likes = likesCount

                           await  userImages.push(image)

                            console.log(userImages[0].likes + " : " + likesCount)
                        }
                    })

                }
            })

            });

            var isOwner = false
            if(req.session.userDetails.username == req.params.id){

              isOwner = true;
            }


            console.log(userImages)

          let myInterval=  setInterval(()=>{

              if(userImages.length > 0){

                res.render('user/gallery/index', {isOwner: isOwner,loggedUser: req.session.userDetails, images : userImages, username: req.params.id})

                clearInterval(myInterval)

              }

            }, 100)

          }else{

            res.render('user/gallery/index', {isOwner: isOwner,loggedUser: req.session.userDetails, images : userImages, username: req.params.id})

          
          }



        }else{

            res.redirect('/profile/' + req.session.userDetails.username)
        }
    })
})


route.post('/post/like/user/image', isAuth, (req, res)=>{

  var postLike = {

    operation : "insert",
    tablename : 'userimagelikes',
    id : new Date() * Math.random()* 1000,
    imageid : req.body.image_id,
    username : req.session.userDetails.username,
    userimage : req.session.userDetails.profileimage
  }

  dbcon.run(postLike).then((feedback)=>{

    if(feedback.code == 200){

      var selectl = {
        operation: 'select',
        tablename : 'userimagelikes',
        fields : [],
        wfield : ['imageid'],
        wvalue : [req.body.image_id]
      }
      dbcon.run(selectl).then((feedback)=>{

        if(feedback.code == 200){

          var count = feedback.result.rows.length

          res.send({code : 200, count : count})
        }else{

          res.send({code : 200})
        }
      })

   

    }else{

      res.send({code : 101})
    }
  })

})

route.get('/user/gallery/image/page/:id', (req, res)=>{

  var selectImageDets = {

    operation: 'select',
    tablename : 'userimages',
    fields : [],
    wfield : ['id'],
    wvalue : [req.params.id]
  }
  
var imagess = null
  dbcon.run(selectImageDets).then((feedback)=>{

    

    if(feedback.code == 200){

      var selImages = {

        operation :'select',
        tablename : 'userimagecomments',
        fields : [],
        wfield : ['imageid'],
        wvalue : [req.params.id]
      }

      imagess = feedback.result.rows[0];

      dbcon.run(selImages).then((feedback)=>{

        var imageComments = feedback.result.rows

        var selImagelikes = {

          tablename: 'userimagelikes',
          operation : 'select',
          fields : [],
          wfield : ['imageid'],
          wvalue : [req.params.id]
        }

        dbcon.run(selImagelikes).then((feedback)=>{

          var imageLIkes = feedback.result.rows

          var likesC = imageLIkes.length
          var commentsC = imageComments.length
          
          if(feedback.code == 200){

            res.render('user/gallery/specImage', {image : imagess,likesCount : likesC,commentsCount : commentsC,likes : imageLIkes, comments : imageComments, loggedUser : req.session.userDetails})


          }else{

            res.render('user/gallery/specImage', {image : imagess,likesCount : imageLIkes.length,commentsCount : imageComments.length,likes : imageLIkes, comments : imageComments, loggedUser : req.session.userDetails})

          }

        })
      })
    }else{

      res.render('user/gallery/specImage', {image : imagess})
    }
  })
})


route.get('/user/reels/video/page/:id', (req, res)=>{

  var usern = req.params.id
  var selectUserVideos = {

    operation: "select",
    tablename : "",
    fields : [],
    wfield : [],
    wvalue : [usern]
  }

  

  res.render('user/gallery/videos')

})
module.exports = route