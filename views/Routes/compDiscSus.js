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

  route.get("/competition/page", isAuth, (req, res) => {
      if(req.session.userDetails != undefined || req.session.userDetails != null){

      
    var userapps ={

        tablename :"businessapp",
        operation: "select",
        fields: [],
        wfield: ["owner"],
        wvalue: [req.session.userDetails.username || false],
    }

    dbcon.run(userapps).then((feedback)=>{

        if(feedback && feedback.code == 200){

            

            res.render("comp/index", {auth: req.session.isAuth, apps : feedback.result.rows , loggedUser: req.session.userDetails});
        }else{

            res.render("comp/index", {auth: req.session.isAuth });

        }
    })

}else{

    res.render("comp/index", {auth: false });

}
  
  });


  route.get("/competition/all", isAuth, (req, res) => {
    if(req.session.userDetails != undefined || req.session.userDetails != null){

    
        var sComApps = {

            operation : "select",
            tablename : "competition",
            fields : [],
            wfield : ['competition_name'],
            wvalue : ['BizBoost Challenge']
        }

  dbcon.run(sComApps).then((feedback)=>{

      if(feedback &&  feedback.code == 200){

          

          res.render("allcompetitions/index", {auth: req.session.isAuth, apps : feedback.result.rows, loggedUser: req.session.userDetails });
      }else{

          res.render("allcompetitions/index", {auth: req.session.isAuth });

      }
  })

}else{

  res.render("allcompetitions/index", {auth: false });

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
        created_at : new Date()

    }

    dbcon.run(selFollowers).then( async (feedback)=>{

        if(feedback && feedback.code == 200){

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
        wvalue : ['BizBoost Challenge']
    }

    dbcon.run(sComApps).then((feedback)=>{

        if(feedback && feedback.code == 200){

            var compRows = feedback.result.rows;

            if(compRows.length >= 0){

             

                var counter = 0;

                compRows.map( async (row) => {

                    counter = counter + 1;
                    
                    var compId = row.BUSINESSAPPID;

                    var username = row.USERNAME

                 // SELECTING business.......................................................-----------------------
    
                    var selectBusinesses = {

                        operation: 'select',
                        tablename : 'businessappstats',
                        fields: [],
                        wfield: ['id'],
                        wvalue : [compId]
                      }

                     await dbcon.run(selectBusinesses).then(async function(results){

                        if (results && results.code == 200){

                            let businessesComp = results
                                .result.rows;
                            
                            
                           await businessesComp?.map(async (element) => {
                                

                                        let total = (parseInt(element['FOLLOWER_COUNT']) * 0.6 + parseInt(element['LIKE_COUNT']) * 0.15 + parseInt(element['ORDER_COUNT']) * 0.25)

                                        element['points_active'] =  (total > 0) ?  (total / 3) : 0

                               element['score'] = element['points_active'] * 100;
                               
                                                          await leaders.push(element)


                            })

                                      

                        }

                    })
                });

                console.log(leaders)
               

                setTimeout(() => {
                    
                                        res.send({code : 200, competitors : leaders})

                }, 6000)
                
               

            }else{

                res.send({code : 500})
            }
            

        }else{

            res.send({code  : 101, data: {error : "Error loading leader board"}})
        }
    })

  })
  module.exports = route;