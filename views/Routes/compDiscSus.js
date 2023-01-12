const { parse } = require("cookie");
const express = require("express");
const { fetchAsBuffer } = require("oracledb");
const clean = require("../databasemanagementMYSQL/clean");
const route = express.Router();

const db = require("./../../oracleDBManager/dbmanager");

const dbcon = new db();

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      res.redirect("/login");
    }
  };

  route.get("/competition/page", (req, res) => {
      if(req.session.userDetails != undefined || req.session.userDetails != null){

      
    var userapps ={

        tablename :"businessapp",
        operation: "select",
        fields: [],
        wfield: ["owner"],
        wvalue: [req.session.userDetails.username || false],
    }

    dbcon.run(userapps).then((feedback)=>{

        if(feedback.code == 200){

            

            res.render("comp/index", {auth: req.session.isAuth, apps : feedback.result.rows });
        }else{

            res.render("comp/index", {auth: req.session.isAuth });

        }
    })

}else{

    res.render("comp/index", {auth: false });

}
  
  });

  route.post("/post/competitors", isAuth, (req, res)=>{

    console.log(req.body.appid)

    var selFollowers  = {

        operation : "insert",
        tablename : "competition",
        id :  new Date() * Math.random() * 10,
        businessappid: parseInt(req.body.appid),
        competition_name : req.body.compname,
        username : req.session.userDetails.username,

    }

    dbcon.run(selFollowers).then( async (feedback)=>{

        if(feedback.code == 200){

            res.send({code : 200})
        }else{
            console.log(feedback.result)

            res.send({code : 101, error : feedback.result})
        }
    })
  })

  route.get('/leaderboard', (req, res)=>{

    var leaders = []
    var sComApps = {

        operation : "select",
        tablename : "competition",
        fields : [],
        wfield : ['competition_name'],
        wvalue : ['young hustle competition']
    }

    dbcon.run(sComApps).then((feedback)=>{

        if(feedback.code == 200){

            var compRows = feedback.result.rows;

            if(compRows.length >= 0){

                var leaderboad = {
                    followers : 0,
                    likes : 0,
                    orders : 0
                }

                var counter = 0;

                compRows.forEach(row => {

                    counter = counter + 1;
                    
                    var compId = row.BUSINESSAPPID;

                    var username = row.USERNAME

                    // SELECTING FOLLOWERS.......................................................-----------------------
    
                    var selectFollowers = {

                        operation: 'select',
                        tablename : 'followers',
                        fields: [],
                        wfield: ['businessappid'],
                        wvalue : [compId]
                      }

                      dbcon.run(selectFollowers).then(function(results){

                        if (results.code == 200){

                          let followerscount =  results
                            .result.rows.length;

                          console.log(followerscount)

                          leaderboad.followers = followerscount

                          // ......................selecting likes ......................//

                          var likequery = {
                            tablename: "applikes",
                            operation: "select",

                            fields: [],

                            wfield: ["businessappid"],

                            wvalue: [row.BUSINESSAPPID],
                          };

                          dbcon
                            .run(likequery)
                            .then(async function (results) {
                              if (results.code == 200) {
                                let likescount = await results
                                  .result.rows.length;

                                leaderboad.likes = likescount

                                var orderS = {

                                    operation : "select",
                                    tablename : "ordercart",
                                    fields : [],
                                    wfield : ['appid'],
                                    wvalue : [row.BUSINESSAPPID]
                                }

                                dbcon.run(orderS).then(async(feedback)=>{

                                    if(feedback.code == 200){

                                        let ordercount = await results
                                        .result.rows.length;

                                        leaderboad.orders = ordercount

                                      
                                       

                                        leaderboad.active = (leaderboad.followers * 0.6 + leaderboad.likes * 0.15 + leaderboad.orders * 0.25) / 3

                                        leaderboad.score = leaderboad.active * 100;
                                        leaderboad.username = username

                                        var userImg = {

                                            operation : "select",
                                            tablename : "users",
                                            fields : ["profileimage"],
                                            wfield : ['username'],
                                            wvalue : [username]
                                        }

                                        dbcon.run(userImg).then((feedback)=>{

                                            if(feedback.code == 200){
                                                var img = feedback.result.rows[0].PROFILEIMAGE
                                                console.log(img)
                                                leaderboad.userimg = img

                                                leaders.push(leaderboad)

                                                if(counter == compRows.length){

                                                    res.send({code : 200, competitors : leaders})
                                                }

                                            }else{

                                                res.send(leaderboad)
                                            }
                                        })

                                        

                                    }else{

                                        res.send({code : 101})
                                    }
                                })

                              }else{

                                res.send({code : 101})
                              }

                            })
                         
                        }else{

                            res.send({code : 101})
                        }

                    })
                    console.log(compId)
                });

                console.log(leaders)
                if(leaders.length > 0){

                    res.send({code : 200, competitors : leaders})
                }
               

            }else{

                res.send({code : 500})
            }
            

        }else{

            res.send({code  : 101, data: {error : "Error loading leader board"}})
        }
    })

  })
  module.exports = route;