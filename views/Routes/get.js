const { parse } = require("cookie");
const express = require("express");
const oracledb = require('oracledb');
const clean = require("../databasemanagementMYSQL/clean");
const route = express.Router();

const db = require("./../../oracleDBManager/dbmanager");
const QueryFunctionData = require("./reduxData/fetchAppData");

const {getConnectionFromPool, checkConnectionHealth} = require("./../../oracleDBManager/dbconnect");
const { error } = require("jquery");

const dbcon = new db();

const isbizSet = (req, res, next) => {
  if (
    req.session.appid != null &&
    req.session.appid != undefined &&
    req.session.isAuth == true
  ) {
    next();
  } else {
    res.redirect("/suscription/page")
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

const isAdmin = (req, res, next) => {


  if (req.session.isAuth) {

    var appid = req.params.id

    console.log(appid)
    var selectOwner = {

      operation: 'select',
      tablename: 'ownerbusiness',
      fields: [],
      wfield: ['username', 'businessappid'],
      wvalue: [req.session.userDetails.username, parseInt(appid)]
    }

    dbcon.run(selectOwner).then(function (results) {
      
      if (results && results.result.rows.length > 0) {
        
        next();
      } else {
        
        res.redirect("/apps/all");
      }
    })


   
  } else {
    res.redirect("/apps/all");
  }
};

const isMyprofile = (req, res, next) => {


  if (req.session.isAuth) {

    var appid = req.params.id

   if(req.session.userDetails.username.match(appid)){

     next();
   } else {
     
     res.redirect("/apps/all");

     
   }
   


  } else {
    res.redirect("/apps/all");
  }
};

route.get("/AddService", isAuth, (req, res) => {
  console.log(req.query.suscription)
  res.render("AddService/index", {sus : req.query.suscription});
});

route.get("/Register", (req, res) => {
  res.render("Register/index", { loggedUser: req.session.userDetails });
});

route.get("/", (req, res) => {
  res.render("home/index", { loggedUser: req.session.userDetails });
});
route.get("/login", (req, res) => {
  res.render("login/index");
});

route.get("/sdetailsa", isbizSet, (req, res) => {
  res.render("servicedetails/index");
});

route.get("/asublocation", isbizSet, (req, res) => {
  res.render("AddService/location");
});

route.get("/addimages", isbizSet, (req, res) => {
  res.render("AddService/images");
});

route.get("/addvideos", isbizSet, (req, res) => {
  res.render("AddService/videos");
});

route.get('/users/apps', isAuth, (req, res) => {
  
  const { username } = req.query
  
  var selectApps = {
    operation : 'select',
    tablename : 'businessapp',
    fields : [],
    wfield : ['owner'],
    wvalue : [req.session.userDetails.username]
  }

  dbcon.run(selectApps).then((result, error) => {

    let results = result.results;
    
    if (results && results.code == 200) {

      var userapps = results.results.rows;

      res.send({code: 200, userapps})
      

    } else {
      
      res.send({code: 101, error: "No user apps found."})
    }

  })

})

route.get("/profile/:id", isAuth, (req, res) => {
  let userProfile = req.params.id;

  var isOwner = null
  var friendrequestid = null;

  let folRes = null;

  var getFriendid = null;
  var checkFriendship = {
    operation : 'select',
    tablename : 'friends',
    fields : [],
    wfield : ['username', 'friend'],
    wvalue : [req.session.userDetails.username, req.params.id]
  }

  var isMyFriend = false

  dbcon.run(checkFriendship).then((feedback)=>{

    if( feedback && feedback.code == 200){

      if(feedback.result.rows.length > 0){

        isMyFriend = true

        getFriendid = feedback.result.rows[0].ID
      }else{

        var checkFriendshipcross = {
          operation : 'select',
          tablename : 'friends',
          fields : [],
          wfield : ['username', 'friend'],
          wvalue : [req.params.id, req.session.userDetails.username]
        }

        dbcon.run(checkFriendshipcross).then((feedback)=>{

          if(feedback &&  feedback.code == 200){

            if(feedback.result.rows.length > 0){

              isMyFriend = true
              getFriendid = feedback.result.rows[0].ID
            }
          }
        })
      }

    }else{


    }
  })
  if(req.params.id.match(req.session.userDetails.username)){

    isOwner = true;
  }else{

    var frq = {

      operation : "select",
      tablename : "friendrequests",
      fields : [],
      wfield : ['sender', 'receiver'],
      wvalue : [req.params.id, req.session.userDetails.username ]
    }
var isAcceptRequest = null;
    dbcon.run(frq).then((feedback)=>{

      if(feedback &&  feedback.code == 200){

        if(feedback.result.rows.length > 0){

          console.log("friend request true")

          isAcceptRequest = true

          friendrequestid = feedback.result.rows[0].ID
        }
      }
    })
  }
  var query = {
    tablename: "users",
    operation: "select",

    fields: [],

    wfield: ["username"],

    wvalue: [req.params.id],
  };

  dbcon.run(query).then(
    function (results) {
      var profile = results.result.rows[0];

      if (results && results.code == 200) {
        var selectLiked = {
          operation: "select",
          tablename: "applikes",
          fields: [],
          wfield: ["username"],
          wvalue: [profile.USERNAME],
        };

        dbcon.run(selectLiked).then(function (results) {
          var profilelikes = results.result.rows;

          if (results && results.code == 200) {
            var selectViews = {
              operation: "select",
              tablename: "views",
              fields: [],
              wfield: ["username"],
              wvalue: [profile.USERNAME],
            };

            dbcon.run(selectViews).then(function (results) {
              if (results && results.code == 200) {
                var profileviews = results.result.rows;


                var selectFollows = {
                  operation: "select",
                  tablename: "followers",
                  fields: [],
                  wfield: ["username"],
                  wvalue: [profile.USERNAME],
                };
                
                dbcon.run(selectFollows).then(resultss => {
                  
                 

                  if (resultss.code === 200) {

                    folRes = resultss.result.rows


                    var myfriends = {

                      operation: 'select',
                      tablename: 'friends',
                      fields: [],
                      wfield: ['username'],

                      wvalue: [req.params.id]

                    }

                    var friends = 0;

                    dbcon.run(myfriends).then((feedback) => {

                      if (feedback &&  feedback.code == 200) {


                        friends += feedback.result.rows.length

                        var hefriends = {

                          operation: 'select',
                          tablename: 'friends',
                          fields: [],
                          wfield: ['friend'],
                          wvalue: [req.params.id]
                        }

                        dbcon.run(hefriends).then((feedback) => {

                          if (feedback && feedback.code == 200) {

                            friends += feedback.result.rows.length

                            console.log(`friends : ${friends}`)

                            if (friends >= 1000) {

                              friends = (friends / 1000) + "k";
                            } else if (friends >= 1000000) {
        
                              friends = (friends / 1000000) + "m"
        
                            }
                                           console.log("follows : ", folRes)

                            res.render("profile/index", {
                              views: profileviews,
                              likes: profilelikes,
                              row: profile,
                              loggedUser: req.session.userDetails,
                              isOwner: isOwner,
                              isAcceptRequest: isAcceptRequest,
                              friendrequestid: friendrequestid,
                              isMyFriend: isMyFriend,
                              friends: friends,
                              friend_id: getFriendid,
                              follows: folRes
                            });
                          }
                        })
                      }
                    })
                    
                  } else {
                    

                  }

              })
              } else {
                console.log(results.result);
                res.render("profile/index", {
                  views: profileviews,
                  likes: profilelikes,
                  row: profile,
                  loggedUser: req.session.userDetails,
                  isOwner : isOwner,
                  isAcceptRequest : isAcceptRequest,
                  friendrequestid: friendrequestid,
                  isMyFriend : isMyFriend,
                  friend_id: getFriendid,
                  follows : folRes

                
                });
              }
            });
          } else {
            res.render("profile/index", {
              row: profile,
              loggedUser: req.session.userDetails,
              isOwner : isOwner,
              isAcceptRequest: isAcceptRequest,
              friendrequestid: friendrequestid,
              isMyFriend : isMyFriend,
              friend_id: getFriendid,
              follows : folRes

            });
          }
        });
      }
    },
    function (err) {
      console.log(err);
    }
  );
});

route.get('/businessdeletecomponents/:id', isAdmin, (req, res) => {
  
  var appid = req.params.id, services = null, locations = null, images = null, video = null, app = null

  if (appid != null && appid != undefined && appid != ''){

    var selectServices = {

      operation : 'select',
      tablename: 'services',
      fields: [],
      wfield: ['businessid'],
      wvalue : [appid]
    }

    dbcon.run(selectServices).then(function(results){

      if (results && results.code == 200){

        services = results.result.rows
        
        var selectLocation = {

          operation: 'select',
          tablename: 'locations',
          fields: [],
          wfield: ['businessappid'],
          wvalue: [appid]
        }

        dbcon.run(selectLocation).then(function (results) {

          if (results && results.code == 200) {

            locations = results.result.rows

            var selectImages = {

              operation: 'select',
              tablename: 'businessimages',
              fields: [],
              wfield: ['businessappid'],
              wvalue: [appid]
            }

            dbcon.run(selectImages).then(function (results) {

              if (results && results.code == 200) {

                images = results.result.rows


                var selectVideo = {

                  operation: 'select',
                  tablename: 'businessvideos',
                  fields: [],
                  wfield: ['businessappid'],
                  wvalue: [appid]
                }

                dbcon.run(selectVideo).then(function (results) {

                  if (results && results.code == 200) {

                    video = results.result.rows


                    var selectApp = {

                      operation: 'select',
                      tablename: 'businessapp',
                      fields: [],
                      wfield: ['id'],
                      wvalue: [appid]
                    }

                    dbcon.run(selectApp).then(function (results) {

                      if (results && results.code == 200) {

                        app = results.result.rows[0]




                        res.render('deleteappscomp/index', {loggedUser : req.session.userDetails, app : app, videos : video, images : images, locations : locations, services : services})


                      } else {

                        res.redirect('/apps/all')

                      }
                    })



                  } else {

                    res.redirect('/apps/all')

                  }
                })



              } else {

                res.redirect('/apps/all')

              }
            })



          } else {

            res.redirect('/apps/all')

          }
        })




      } else {
        
        res.redirect('/apps/all')

      }
    })

  } else {
    
    res.redirect('/apps/all')
  }
})

route.get("/app/:appname", async (req, res) => {
  let bizProfile = req.params.id;
  var videos,
    services,
    images,
    location,
    related,
    social,
    ratings,
    reviews,
    sus,
    gold,
    prenium,
    basic ,
    s = null;

    const businessId = req.query.id; // Replace with the desired business ID
    // Replace with the actual business ID
    const businessName = clean.CleanData(req.query.appname);
    const cat = parseInt(req.query.cat);
    // Replace with the actual business name

      // let fq = new QueryFunctionData()

     let jsD =  await new QueryFunctionData().queryBusinessData(businessId, cat, dbcon.getDbConnecting() )


     


        sus = jsD?.APP[0]?.SUSCRIPTION;
        
        ratings = []

        row = jsD.APP[0]

        for(let i =0 ; i < jsD?.APP[0]?.RATE_COUNT; i++){

          ratings.push(1)

        }

        
    if(sus == "gold"){

    gold = "hideDiv"
    }else if(sus == "prenium"){

      prenium = "hideDiv"

    }else if(sus == "basic"){

      basic = "hideDiv"
    }

    let isOwner = (jsD?.APP[0]?.OWNER === req?.session?.userDetails?.username)

    var newLike = {
        id:
          new Date() *
          Math.round(Math.random() * 17),
        username:req?.session?.userDetails?.username,
        businessappid: jsD?.APP[0]?.ID,
        appname: jsD?.APP[0]?.BUSINESSNAME,
        appimage: jsD?.APP[0]?.BRANDICON,
        created_at : new Date(),
        category : jsD?.APP[0]?.BUSINESSCATEGORY,
        tablename: "views",
        operation: "insert",
      };

      dbcon.run(newLike).then((result)=>{

        console.log("rate no : ", ratings)

        res.render("serviceApp/index", {
          ratings: ratings,
          loggedUser: req.session.userDetails,
          social: social,
          row: row,
         
          isowner: isOwner,
          gold : gold,
          basic : basic,
          prenium: prenium
          
        });
        

      })
    
})

route.get('/get-services/:appid', (req, res)=>{

  const appid = req.params.appid;

  var servicequery = {
              tablename: "services",
              operation: "select",
    
              fields: [],
    
              wfield: ["businessid"],
    
              wvalue: [appid],
            };
    
            dbcon.run(servicequery).then(function (results) {
              if (results && results.code === 200) {
               let  services = results.result.rows;

                if(services?.length > 0){

                  res.send({code : 200, message: 'Service/Products successfully retrieved.', services})

                }else{


                  res.send({code : 201, message: 'No Services/products Found!', services})


                }



              }else{

                res.send({code : 101, message: 'Error fetching service! Kindly try again. \n if the issue , contact support for assistance.'})
              }

            })
    

})

route.get('/get-images/:appid', (req, res)=>{

  const appid = req.params.appid;

  var imagequery = {
                  tablename: "businessimages",
                  operation: "select",
    
                  fields: [],
    
                  wfield: ["businessappid"],
    
                  wvalue: [appid],
                };
    
    
            dbcon.run(imagequery).then(function (results) {
              if (results && results.code === 200) {
               let  images= results.result.rows;

                if(images?.length > 0){

                  res.send({code : 200, message: 'Images successfully retrieved.', images})

                }else{


                  res.send({code : 201, message: 'No images Found!', images})


                }



              }else{

                res.send({code : 101, message: 'Error fetching images! Kindly try again. \n if the issue , contact support for assistance.'})
              }

            })
    

})

route.get('/get-videos/:appid', (req, res)=>{

  const appid = req.params.appid;

  var videosquery = {
                      tablename: "businessvideos",
                      operation: "select",
    
                      fields: [],
    
                      wfield: ["businessappid"],
    
                      wvalue: [appid],
                    };
    
    
            dbcon.run(videosquery).then(function (results) {
              if (results && results.code === 200) {
               let  videos= results.result.rows;

                if( videos?.length > 0){

                  res.send({code : 200, message: ' videos successfully retrieved.',  videos})

                }else{


                  res.send({code : 201, message: 'No  videos Found!',  videos})


                }



              }else{

                res.send({code : 101, message: 'Error fetching  videos! Kindly try again. \n if the issue , contact support for assistance.'})
              }

            })
    

})

route.get('/get-locations/:appid', (req, res)=>{

  const appid = req.params.appid;

  var locationquery = {
        tablename: "locations",
        operation: "select",

        fields: [],

        wfield: ["businessappid"],

        wvalue: [appid],
      };
    
    
            dbcon.run(locationquery).then(function (results) {
              if (results && results.code === 200) {
               let  videos= results.result.rows;

                if( videos?.length > 0){

                  res.send({code : 200, message: ' Branch Locations successfully retrieved.',  locations : videos})

                }else{


                  res.send({code : 201, message: 'No  branch locations Found!',  locations : videos})


                }



              }else{

                res.send({code : 101, message: 'Error fetching  branch location! Kindly try again. \n if the issue , contact support for assistance.'})
              }

            })
    

})


route.get('/get-reviews/:appid', (req, res)=>{

  const appid = req.params.appid;

  var commentquery = {
      tablename: "businessreviews",
      operation: "select",

      fields: [],

      wfield: ["businessappid"],

      wvalue: [appid],
    };
    
    
            dbcon.run(commentquery).then(function (results) {
              if (results && results.code === 200) {
               let  reviews= results.result.rows;

                if( reviews?.length > 0){

                  res.send({code : 200, message: ' Reviews successfully retrieved.',  reviews})

                }else{


                  res.send({code : 201, message: 'No  reviews Found!',  reviews})


                }



              }else{

                res.send({code : 101, message: 'Error fetching  reviews! Kindly try again. \n if the issue , contact support for assistance.'})
              }

            })
    

})

route.get('/get-related/:appid', (req, res)=>{

  const appid = req.params.appid;

 var relatedquery = {
            tablename: "businessapp",
            operation: "select",

            fields: [],

            wfield: ["businesscategory"],

            wvalue: [appid],
          };
    
    
            dbcon.run(relatedquery).then(function (results) {
              if (results && results.code === 200) {
               let  related= results.result.rows;

                if( related?.length > 0){

                  res.send({code : 200, message: ' Related apps successfully retrieved.',  related})

                }else{


                  res.send({code : 201, message: 'No  related apps Found!',  related})


                }



              }else{

                res.send({code : 101, message: 'Error fetching  related apps! Kindly try again. \n if the issue , contact support for assistance.'})
              }

            })
    

})
// })
// route.get("/app/:id", (req, res) => {
//   var videos,
//     services,
//     images,
//     location,
//     related,
//     social,
//     ratings,
//     reviews,
//     sus,
//     gold,
//     prenium,
//     basic ,
//     s = null;


//   var query = {
//     tablename: "businessapp",
//     operation: "select",

//     fields: [],

//     wfield: ["businessname"],

//     wvalue: [req.params.id],
//   };

//   dbcon.run(query).then(
//     function (results) {
//       if (results.code == 200) {
//         var row = results.result.rows[0];

//         sus = row.SUSCRIPTION;
//         row.BUSINESSNAME = row.BUSINESSNAME

        
//     if(sus == "gold"){

//     gold = "hideDiv"
//     }else if(sus == "prenium"){

//       prenium = "hideDiv"

//     }else if(sus == "basic"){

//       basic = "hideDiv"
//     }

//         var servicequery = {
//           tablename: "services",
//           operation: "select",

//           fields: [],

//           wfield: ["businessid"],

//           wvalue: [row.ID],
//         };

//         dbcon.run(servicequery).then(function (results) {
//           if (results.code == 200) {
//             services = results.result.rows;

//             var imagequery = {
//               tablename: "businessimages",
//               operation: "select",

//               fields: [],

//               wfield: ["businessappid"],

//               wvalue: [row.ID],
//             };

//             dbcon.run(imagequery).then(function (results) {
//               if (results.code == 200) {
//                 images = results.result.rows;

//                 var videosquery = {
//                   tablename: "businessvideos",
//                   operation: "select",

//                   fields: [],

//                   wfield: ["businessappid"],

//                   wvalue: [row.ID],
//                 };

//                 dbcon.run(videosquery).then(function (results) {
//                   if (results.code == 200) {
//                     videos = results.result.rows;

//                     var locationquery = {
//                       tablename: "locations",
//                       operation: "select",

//                       fields: [],

//                       wfield: ["businessappid"],

//                       wvalue: [row.ID],
//                     };

//                     dbcon.run(locationquery).then(function (results) {
//                       if (results.code == 200) {
//                         location = results.result.rows;

//                         var relatedquery = {
//                           tablename: "businessapp",
//                           operation: "select",

//                           fields: [],

//                           wfield: ["businesscategory"],

//                           wvalue: [row.BUSINESSCATEGORY],
//                         };

//                         dbcon.run(relatedquery).then(function (results) {
//                           if (results.code == 200) {
//                             related = results.result.rows;

                           

//                                 var ratingquery = {
//                                   tablename: "ratings",
//                                   operation: "select",

//                                   fields: [],

//                                   wfield: ["businessappid"],

//                                   wvalue: [row.ID],
//                                 };

//                                 dbcon.run(ratingquery).then(function (results) {
//                                   if (results.code == 200) {
//                                     var totaluser = results.result.rows.length;

//                                     var ratings = results.result.rows;

//                                     var totalratings = 0;

//                                     ratings.forEach((element) => {
//                                       totalratings =
//                                         totalratings + element.RATINGNO;
//                                     });

//                                     var averagerating = Math.round(
//                                       totalratings / totaluser
//                                     );

//                                     var startcounter = 0;

//                                     ratings = [];

//                                     while (startcounter < averagerating) {
//                                       ratings.push(startcounter);

//                                       startcounter++;
//                                     }

//                                     var commentquery = {
//                                       tablename: "businessreviews",
//                                       operation: "select",

//                                       fields: [],

//                                       wfield: ["businessappid"],

//                                       wvalue: [row.ID],
//                                     };

//                                     dbcon
//                                       .run(commentquery)
//                                       .then(function (results) {
//                                         if (results.code == 200) {
//                                           reviews = results.result.rows;

//                                           var likequery = {
//                                             tablename: "applikes",
//                                             operation: "select",

//                                             fields: [],

//                                             wfield: ["businessappid"],

//                                             wvalue: [row.ID],
//                                           };

//                                           dbcon
//                                             .run(likequery)
//                                             .then(async function (results) {
//                                               if (results.code == 200) {
//                                                 let likescount = await results
//                                                   .result.rows.length;

//                                                 console.log(likescount);

//                                                 row.likes = likescount;

//                                                 var viewquery = {
//                                                   tablename: "views",
//                                                   operation: "select",

//                                                   fields: [],

//                                                   wfield: ["businessappid"],

//                                                   wvalue: [row.ID],
//                                                 };

//                                                 dbcon
//                                                   .run(viewquery)
//                                                   .then(async function (
//                                                     results
//                                                   ) {
//                                                     if (results.code == 200) {
//                                                       let viewcounts = await results
//                                                         .result.rows.length;

//                                                       console.log(viewcounts);

//                                                       row.views = viewcounts;

//                                                       var selectFollowers = {

//                                                         operation: 'select',
//                                                         tablename : 'followers',
//                                                         fields: [],
//                                                         wfield: ['businessappid'],
//                                                         wvalue : [row.ID]
//                                                       }

//                                                       dbcon.run(selectFollowers).then(function(results){

//                                                         if (results.code == 200){

//                                                           let followerscount =  results
//                                                             .result.rows.length;

                                                        

//                                                           row.followers = followerscount;



//                                                           console.log("results successful");

//                                                           if (
//                                                             req.session.userDetails != null &&
//                                                             req.session.userDetails != undefined
//                                                           ) {
//                                                             var newLike = {
//                                                               id:
//                                                                 new Date() *
//                                                                 Math.round(Math.random() * 17),
//                                                               username:
//                                                                 req.session.userDetails
//                                                                   .username,
//                                                               businessappid: row.ID,
//                                                               appname: row.BUSINESSNAME,
//                                                               appimage: row.BRANDICON,
//                                                               created_at : new Date(),
//                                                               tablename: "views",
//                                                               operation: "insert",
//                                                             };

//                                                             if (
//                                                               newLike.id != null &&
//                                                               newLike.id != undefined &&
//                                                               newLike.username != null &&
//                                                               newLike.username != undefined &&
//                                                               newLike.businessappid != null &&
//                                                               newLike.businessappid != undefined
//                                                             ) {
//                                                               dbcon
//                                                                 .run(newLike)
//                                                                 .then(function (results) {
//                                                                   if (results.code == 200) {
//                                                                     console.log({
//                                                                       code: 200,
//                                                                       result: "Like successful",
//                                                                     });
//                                                                   } else {
//                                                                     console.log({
//                                                                       code: 101,
//                                                                       result: "already liked",
//                                                                     });
//                                                                   }
//                                                                 });
//                                                             } else {
//                                                               console.log({
//                                                                 code: 101,
//                                                                 result: "error",
//                                                               });
//                                                             }


//                                                             var selectOwner = {

//                                                               operation: 'select',
//                                                               tablename: 'ownerbusiness',
//                                                               fields: [],
//                                                               wfield: ['businessappid'],
//                                                               wvalue: [row.ID]
//                                                             }

//                                                             var isOwner = false;
//                                                             dbcon.run(selectOwner).then(function (results) {

//                                                               if (results.code == 200) {

//                                                                 var owners = results.result.rows

//                                                                 owners.forEach(element => {

//                                                                   if (element.USERNAME == req.session.userDetails.username) {

//                                                                     isOwner = true;


//                                                                   }

//                                                                 });

//                                                                 console.log(gold)

//                                                                 res.render("serviceApp/index", {
//                                                                   comments: reviews,
//                                                                   ratings: ratings,
//                                                                   loggedUser: req.session.userDetails,
//                                                                   social: social,
//                                                                   row: row,
//                                                                   videos: videos,
//                                                                   images: images,
//                                                                   services: services,
//                                                                   location: location,
//                                                                   related: related,
//                                                                   loggedUser: req.session.userDetails,
//                                                                   isowner: isOwner,
//                                                                   gold : gold,
//                                                                   basic : basic,
//                                                                   prenium: prenium
                                                                  
//                                                                 });


//                                                               } else {

//                                                                 console.log(gold)
//                                                                 res.render("serviceApp/index", {
//                                                                   comments: reviews,
//                                                                   ratings: ratings,
//                                                                   loggedUser: req.session.userDetails,
//                                                                   social: social,
//                                                                   row: row,
//                                                                   videos: videos,
//                                                                   images: images,
//                                                                   services: services,
//                                                                   location: location,
//                                                                   related: related,
//                                                                   loggedUser: req.session.userDetails,
//                                                                   isowner: isOwner,
//                                                                   basic : basic,
//                                                                   prenium: prenium,
//                                                                   gold : gold
                                                              
//                                                                 });



//                                                               }
//                                                             })

//                                                           } else {

//                                                             console.log(gold)
//                                                             res.render(
//                                                               "serviceApp/index",
//                                                               {
//                                                                 comments: reviews,
//                                                                 ratings: ratings,
//                                                                 loggedUser:
//                                                                   req.session
//                                                                     .userDetails,
//                                                                 social: social,
//                                                                 row: row,
//                                                                 videos: videos,
//                                                                 images: images,
//                                                                 services: services,
//                                                                 location: location,
//                                                                 related: related,
//                                                                 loggedUser:
//                                                                   req.session
//                                                                     .userDetails,
//                                                                     basic : basic,
//                                                                     prenium: prenium,
//                                                                     gold: gold
//                                                               }
//                                                             );
//                                                           }


//                                                         }else{

//                                                           console.log(gold)
//                                                           res.render(
//                                                             "serviceApp/index",
//                                                             {
//                                                               comments: reviews,
//                                                               ratings: ratings,
//                                                               loggedUser:
//                                                                 req.session
//                                                                   .userDetails,
//                                                               social: social,
//                                                               row: row,
//                                                               videos: videos,
//                                                               images: images,
//                                                               services: services,
//                                                               location: location,
//                                                               related: related,
//                                                               loggedUser:
//                                                                 req.session
//                                                                   .userDetails,
//                                                                   basic : basic,
//                                                                   prenium: prenium,
//                                                                   gold : gold
//                                                             }
//                                                           );

//                                                         }
//                                                       })

//                                                     } else {
//                                                       console.log(
//                                                         results.result
//                                                       );

//                                                       console.log(gold)
//                                                          res.render(
//                                                            "serviceApp/index",
//                                                            {
//                                                              comments: reviews,
//                                                              ratings: ratings,
//                                                              loggedUser:
//                                                                req.session
//                                                                  .userDetails,
//                                                              social: social,
//                                                              row: row,
//                                                              videos: videos,
//                                                              images: images,
//                                                              services: services,
//                                                              location: location,
//                                                              related: related,
//                                                              loggedUser:
//                                                                req.session
//                                                                  .userDetails,
//                                                                  basic : basic,
//                                                                  prenium: prenium,
//                                                                  gold : gold
//                                                            }
//                                                          );
//                                                     }
//                                                   });
//                                               } else {
//                                                   console.log(results.result);

//                                                   console.log(gold)
//                                                    res.render(
//                                                      "serviceApp/index",
//                                                      {
//                                                        comments: reviews,
//                                                        ratings: ratings,
//                                                        loggedUser:
//                                                          req.session
//                                                            .userDetails,
//                                                        social: social,
//                                                        row: row,
//                                                        videos: videos,
//                                                        images: images,
//                                                        services: services,
//                                                        location: location,
//                                                        related: related,
//                                                        loggedUser:
//                                                          req.session
//                                                            .userDetails,
//                                                            basic : basic,
//                                                            prenium: prenium,
//                                                            gold: gold
//                                                      }
//                                                    );
//                                               }
//                                             });

                                         

                                         
//                                         } else {
//                                           console.log(results.result);

//                                           console.log(gold)
//                                           res.render("serviceApp/index", {
//                                             comments: reviews,
//                                             ratings: ratings,
//                                             loggedUser: req.session.userDetails,
//                                             social: social,
//                                             row: row,
//                                             videos: videos,
//                                             images: images,
//                                             services: services,
//                                             location: location,
//                                             related: related,
//                                             loggedUser: req.session.userDetails,
//                                             basic : basic,
//                                             gold : gold,
//                                             prenium: prenium
//                                           });
//                                         }
//                                       });
//                                   } else {
//                                     console.log(gold)
//                                     res.render("serviceApp/index", {
//                                       comments: reviews,
//                                       ratings: ratings,
//                                       loggedUser: req.session.userDetails,
//                                       social: social,
//                                       row: row,
//                                       videos: videos,
//                                       images: images,
//                                       services: services,
//                                       location: location,
//                                       related: related,
//                                       loggedUser: req.session.userDetails,
//                                       basic : basic,
//                                       prenium: prenium,
//                                       gold : gold
//                                     });
//                                   }
//                                 });
                          
//                           } else {
//                             console.log(results.result);

//                             console.log(gold)

//                             res.render("serviceApp/index", {
//                               comments: reviews,
//                               ratings: ratings,
//                               loggedUser: req.session.userDetails,
//                               social: social,
//                               row: row,
//                               videos: videos,
//                               images: images,
//                               services: services,
//                               location: location,
//                               related: related,
//                               loggedUser: req.session.userDetails,
//                               basic : basic,
//                               prenium: prenium,
//                               gold: gold
//                             });
//                           }
//                         });
//                       } else {
//                         console.log(results.result);

//                         console.log(gold)

//                         res.render("serviceApp/index", {
//                           comments: reviews,
//                           ratings: ratings,
//                           loggedUser: req.session.userDetails,
//                           social: social,
//                           row: row,
//                           videos: videos,
//                           images: images,
//                           services: services,
//                           location: location,
//                           related: related,
//                           loggedUser: req.session.userDetails,
//                           gold : gold,
//                           basic : basic,
//                           prenium: prenium
//                         });
//                       }
//                     });
//                   } else {
//                     console.log(results.result);

//                     console.log(gold)

//                     res.render("serviceApp/index", {
//                       comments: reviews,
//                       ratings: ratings,
//                       loggedUser: req.session.userDetails,
//                       social: social,
//                       row: row,
//                       videos: videos,
//                       images: images,
//                       services: services,
//                       location: location,
//                       related: related,
//                       loggedUser: req.session.userDetails,
//                       basic : basic,
//                       prenium: prenium,
//                       gold: gold
//                     });
//                   }
//                 });
//               } else {
//                 console.log(results.result);

//                 console.log(gold)

//                 res.render("serviceApp/index", {
//                   comments: reviews,
//                   ratings: ratings,
//                   loggedUser: req.session.userDetails,
//                   social: social,
//                   row: row,
//                   videos: videos,
//                   images: images,
//                   services: services,
//                   location: location,
//                   related: related,
//                   loggedUser: req.session.userDetails,
//                   basic : basic,
//                   prenium: prenium,
//                   gold: gold
//                 });
//               }
//             });
//           } else {
//             console.log(results.result);

//             console.log(gold)

//             res.render("serviceApp/index", {
//               gold : gold,
//               comments: reviews,
//               ratings: ratings,
//               loggedUser: req.session.userDetails,
//               social: social,
//               row: row,
//               videos: videos,
//               images: images,
//               services: services,
//               location: location,
//               related: related,
//               loggedUser: req.session.userDetails,
//               basic : basic,
//               prenium: prenium,
              
//             });
//           }
//         });
//       } else {
//         console.log(results.result);

//         console.log(gold)

//         res.render("Error/index");
//       }
//     },
//     function (err) {
//       console.log(err);
//     }
//   );
// });


route.get('/apps/:id', (req, res)=>{

  var catid = req.params.id;

  var wholesales = [];
  var lifestyle = [];
  var beauty = [];
  var technology = [];
  var education = [];
  var consultancy = [];
  if (catid != null && catid != undefined && catid != "") {
    if (catid.match("all")) {
      var appsquery = {
        tablename: "BUSINESSAPPSTATS",
        operation: "select",

        fields: [],

        
      };

      console.log(appsquery)

      dbcon.run(appsquery).then(function (results) {

        console.log(results)
        if (results?.code == 200) {
          var apps = results?.result?.rows;
         

          var appcounter = 0;

          while (appcounter < apps?.length) {
            var app = apps[appcounter];

            if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("1")) {
              wholesales.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("2")) {
              lifestyle.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("3")) {
              beauty.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("4")) {
              technology.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("5")) {
              education.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("6")) {
              consultancy.push(app);
            } else {
              console.log("Category id not defined");
            }

            appcounter++;
          }

          var catsapps = {
            Wholesales: wholesales,
            Beauty: beauty,
            Lifestyle: lifestyle,
            Technology: technology,
            Education: education,
            Consultancy: consultancy,
          };

          res.render("homezapps/index", {
            loggedUser: req.session.userDetails,
            appscat: catsapps,
            apps
          });

        }
      })

    }else{

      var appsquery = {
        tablename: "BUSINESSAPPSTATS",
        operation: "select",

        fields: [],

        wfield : ['BUSINESSCATEGORY'],
        wvalue : [catid]

        
      };

      console.log(appsquery)

      dbcon.run(appsquery).then(function (results) {

        console.log(results)
        if (results?.code == 200) {
          var apps = results?.result?.rows;
         

          var appcounter = 0;

          while (appcounter < apps?.length) {
            var app = apps[appcounter];

            if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("1")) {
              wholesales.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("2")) {
              lifestyle.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("3")) {
              beauty.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("4")) {
              technology.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("5")) {
              education.push(app);
            } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("6")) {
              consultancy.push(app);
            } else {
              console.log("Category id not defined");
            }

            appcounter++;
          }

          var catsapps = {
            Wholesales: wholesales,
            Beauty: beauty,
            Lifestyle: lifestyle,
            Technology: technology,
            Education: education,
            Consultancy: consultancy,
          };

          res.render("homezapps/index", {
            loggedUser: req.session.userDetails,
            appscat: catsapps,
            apps
          });

        }
      })


    }

  }

})

// route.get("/webapps/:id", (req, res) => {
//   var catid = req.params.id;

//   var wholesales = [];
//   var lifestyle = [];
//   var beauty = [];
//   var technology = [];
//   var education = [];
//   var consultancy = [];
//   if (catid != null && catid != undefined && catid != "") {
//     if (catid.match("all")) {
//       var appsquery = {
//         tablename: "businessapp",
//         operation: "select",

//         fields: [],
//       };

//       dbcon.run(appsquery).then(function (results) {
//         if (results.code == 200) {
//           var apps = results.result.rows;

//           var appcounter = 0;

//           while (appcounter < apps.length) {
//             var app = apps[appcounter];

//             if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("1")) {
//               wholesales.push(app);
//             } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("2")) {
//               lifestyle.push(app);
//             } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("3")) {
//               beauty.push(app);
//             } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("4")) {
//               technology.push(app);
//             } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("5")) {
//               education.push(app);
//             } else if (`${apps[appcounter].BUSINESSCATEGORY}`.startsWith("6")) {
//               consultancy.push(app);
//             } else {
//               console.log("Category id not defined");
//             }

//             appcounter++;
//           }

//           var catsapps = {
//             Wholesales: wholesales,
//             Beauty: beauty,
//             Lifestyle: lifestyle,
//             Technology: technology,
//             Education: education,
//             Consultancy: consultancy,
//           };

//           for (const key in catsapps) {
//             if (catsapps.hasOwnProperty(key)) {
//               const element = catsapps[key];

//               element.forEach((app) => {
//                 var likequery = {
//                   tablename: "applikes",
//                   operation: "select",

//                   fields: [],

//                   wfield: ["businessappid"],

//                   wvalue: [app.ID],
//                 };

//                 dbcon.run(likequery).then(async function (results) {
//                   if (results.code == 200) {
//                     let likescount = await results.result.rows.length;

//                     console.log(likescount);

//                     app.likes = likescount;

//                     var viewquery = {
//                       tablename: "views",
//                       operation: "select",

//                       fields: [],

//                       wfield: ["businessappid"],

//                       wvalue: [app.ID],
//                     };

//                     dbcon.run(viewquery).then(async function (results) {
//                       if (results.code == 200) {
//                         let viewcounts = await results.result.rows.length;

//                         console.log(viewcounts);

//                         app.views = viewcounts;
//                       } else {
//                         console.log(results.result);
//                       }
//                     });
//                   } else {
//                     console.log(results.result);
//                   }
//                 });
//               });
//             }
//           }

//           setTimeout(function () {
//             res.render("homezapps/index", {
//               loggedUser: req.session.userDetails,
//               appscat: catsapps,
//             });
//           }, 7000);
//         } else {
//           res.send({ error: 404, text: "Could not get the apps try again..." });
//         }
//       });
//     } else {
//       var categoryquery = {
//         tablename: "businesscategories",
//         operation: "select",

//         fields: [],

//         wfield: ["id"],

//         wvalue: [parseInt(catid)],
//       };

//       dbcon.run(categoryquery).then(function (results) {
//         if (results.code == 200) {
//          // var catsubcategory = results.result.rows[0].SUBCATEGORY;

//           var appquery = {
//             tablename: "businessapp",
//             operation: "select",

//             fields: [],

//             wfield: ["businesscategory"],

//             wvalue: [parseInt(catid)],
//           };

//           dbcon.run(appquery).then(async function (results) {
//             if (results.code == 200) {
//               let apps = results.result.rows;

//               await apps.forEach((app) => {
//                 var likequery = {
//                   tablename: "applikes",
//                   operation: "select",

//                   fields: [],

//                   wfield: ["businessappid"],

//                   wvalue: [app.ID],
//                 };

//                 dbcon.run(likequery).then(async function (results) {
//                   if (results.code == 200) {
//                     let likescount = await results.result.rows.length;

//                     console.log(likescount);

//                     app.likes = likescount;

//                     var viewquery = {
//                       tablename: "views",
//                       operation: "select",

//                       fields: [],

//                       wfield: ["businessappid"],

//                       wvalue: [app.ID],
//                     };

//                     dbcon.run(viewquery).then(async function (results) {
//                       if (results.code == 200) {
//                         let viewcounts = await results.result.rows.length;

//                         console.log(viewcounts);

//                         app.views = viewcounts;
//                       } else {
//                         console.log(results.result);
//                       }
//                     });
//                   } else {
//                     console.log(results.result);
//                   }
//                 });
//               });

//               console.log("working...");

//               setTimeout(function () {
//                 res.render("homezapps/index", {
//                   loggedUser: req.session.userDetails,
//                   appscat: { subcategories: apps },
//                 });
//               }, 3000);
//             } else {
//               res.send({ code: 101, error: "The apps does not exit" });
//             }
//           });
//         } else {
//           res.send({ code: 101, error: "The category does not exit" });
//         }
//       });
//     }
//   } else {
//     res.send({ error: 404, text: "App does not Exist" });
//   }
// });

route.get("/usersorders/:id", isMyprofile, (req, res) => {
  var username = req.params.id;

  if (username.match(req.session.userDetails.username)) {
    var calloreder = {
      tablename: "customerorderview",
      operation: "select",

      fields: [],
      wfield: ["username", "status"],

      wvalue: [username, 1],
    };

    dbcon.run(calloreder).then(async function (results) {
      if (results && results.code == 200) {
        var orders = results.result.rows;

        orders?.map((order)=>{

          order['total'] = order?.QUANTITY  * order?.PRICE

        })

        

        console.log(orders)
      
          return res.render("order/index", {
            loggedUser: req.session.userDetails,
            orders,
          });

      } else {
        res.render("order/index", { error: "No order was found" });
      }
    });
  } else {
    res.redirect("/profile/" + req.session.userDetails.username);
  }
});
// route.get("/usersorders/:id", isMyprofile, (req, res) => {
//   var username = req.params.id;

//   if (username.match(req.session.userDetails.username)) {
//     var calloreder = {
//       tablename: "bookings",
//       operation: "select",

//       fields: [],
//       wfield: ["username"],

//       wvalue: [username],
//     };

//     dbcon.run(calloreder).then(async function (results) {
//       if (results.code == 200) {
//         var orders = results.result.rows;

//         var retrievedServiceDetailarray = [];

//         var orderCounter = 0;
//         await orders.forEach((order) => {
//           var retrieveOrderdetails = {
//             operation: "select",
//             tablename: "services",
//             fields: [],
//             wfield: ["id"],
//             wvalue: [order.SERVICEID],
//           };

//           dbcon.run(retrieveOrderdetails).then(async function (results) {
//             if (results.code == 200) {
//               var app = results.result.rows[0];

//               app.quantity = order.QUANTITY;

//               app.orderid = order.ID;

//               app.ischeckedout = order.CHECKEDOUT;
//               app.username = order.USERNAME;
//               app.type = order.TYPE;

//               await retrievedServiceDetailarray.push(app);
//             }
//           });
//         });

//         setTimeout(function () {
//           console.log(retrievedServiceDetailarray);

//           return res.render("order/index", {
//             loggedUser: req.session.userDetails,
//             orders: retrievedServiceDetailarray,
//           });
//         }, 7000);
//       } else {
//         res.render("order/index", { error: "No order was found" });
//       }
//     });
//   } else {
//     res.redirect("/profile/" + req.session.userDetails.username);
//   }
// });

// route.get("/businessorders/:id", isAdmin, (req, res) => {
//   var bookingList = []
//   var businessappid = req.params.id;

//   var businessname = req.query.appname;

//   console.log(businessname)

//   var selectcheckedorders = {
//     operation: "select",

//     tablename: "bookings",

//     fields: [],

//     wfield: ["businessappid"],

//     wvalue: [parseInt(businessappid)],
//   };

//   if (businessappid != null && businessappid != undefined) {
//     dbcon.run(selectcheckedorders).then(function (results) {
//       if (results.code == 200) {
//         var checkedorders = results.result.rows;

//       checkedorders.forEach(element => {

//         element.appname = businessname

//         var getServiceID = {
//           operation: "select",
      
//           tablename: "services",
      
//           fields: [],
      
//           wfield: ["id"],
      
//           wvalue: [parseInt(element.SERVICEID)],
//         };

//         dbcon.run(getServiceID).then(function(servResults){

//           if(servResults.code == 200){

//             var serviceDet = servResults.result.rows[0]
         

//             if(serviceDet){

//               element.SERVICENAME = serviceDet.SERVICENAME
//               element.SERVICEIMAGE = serviceDet.SERVICEICON

//             }

//             bookingList.push(element)
          
            

//           }
//         })

      
         
//        });

//        setTimeout(()=>{

    
       
//         res.render("businessorders/index", {
//           loggedUser: req.session.userDetails,
//           orders: bookingList,
         
//         });
//        }, 3000)
      
//       } else {
//         console.log(results.result);
//         res.send({
//           code: 101,
//           error: "Error getting orders ...please try again",
//         });
//       }
//     });
//   } else {
//     res.redirect("/apps/all");
//   }
// });

route.get("/businessorders/:id", isAdmin, (req, res) => {
  var bookingList = []
  var businessappid = req.params.id;

  var businessname = req.query.appname;

  console.log(businessname)

  var selectcheckedorders = {
    operation: "select",

    tablename: "customerorderview",

    fields: [],

    wfield: ["appid", "status"],

    wvalue: [parseInt(businessappid), 1],
  };

  if (businessappid != null && businessappid != undefined) {
    dbcon.run(selectcheckedorders).then(function (results) {
      if (results && results.code == 200) {
        var checkedorders = results.result.rows;

        console.log(checkedorders)

        res.render("businessorders/index", {
          loggedUser: req.session.userDetails,
          orders: checkedorders,
         
        });

      
      } else {
        console.log(results.result);
        res.send({
          code: 101,
          error: "Error getting orders ...please try again",
        });
      }
    });
  } else {
    res.redirect("/apps/all");
  }
});

route.get("/businesscartorders/:id", isAdmin,(req, res) => {

  var checkoutList = []
  var businessappid = req.params.id;

  var businessname = req.query.appname;

  var selectcartorders = {
    operation: "select",

    tablename: "customercartview",

    fields: [],

    wfield: ["appid", "cartstatus"],

    wvalue: [parseInt(businessappid), 'pending'],
  };

  if (businessappid != null && businessappid != undefined) {
    dbcon.run(selectcartorders).then(function (results) {
      if (results && results.code == 200) {
        var checkedorders = results.result.rows;

      
          res.render("businesscartorder/index", {
            loggedUser: req.session.userDetails,
            orders: checkedorders,
           
          });
      } else {
        console.log(results.result);
        res.send({
          code: 101,
          error: "Error getting orders ...please try again",
        });
      }
    });
  } else {
    res.redirect("/apps/all");
  }
});

route.get("/emailverification", (req, res) => {

  const code = clean.CleanData(req.query.code)
  const username = clean.CleanData(req.query.username)

  console.log("verify cred ",code, username)

  res.render("verifyemail/index", {code, username});


});

route.get("/emailchangepass/:id", (req, res) => {
  var requesterEmail = clean.CleanData(req.params.id)
  if (requesterEmail != null && requesterEmail != undefined && requesterEmail != '') {
    

    res.render("passwordchange/index", { requesterEmail: requesterEmail});

  }else{

    res.send({code : 101, error : 'Password change error...'})
  }

});

route.get('/getagreetoterms', (req, res)=>{

  res.render('termsandconditions/index')
})

module.exports = route;
