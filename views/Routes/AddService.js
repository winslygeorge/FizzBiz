const express = require("express");

const formidable = require("formidable");

const clean = require("./../databasemanagementMYSQL/clean");

const db = require("./../../oracleDBManager/dbmanager");

const genEmail = require("./../../email/genSendEmail");
const optionGen = require("./../../email/emailoptionsgenerator");
const options = new optionGen();

const gen = new genEmail();

const path = require("path");

const fs = require("fs");
const { cleanData } = require("jquery");
const { formatDate } = require("../components/dateFormat");
const { use } = require("./get");
const { user } = require("../../oracleDBManager/dbconfig");

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
  console.log(req.session)
  if (req?.session?.isAuth === true) {
    console.error('auth succeded')
    next();

  } else {
    res.redirect('/login')
 
  }
};

route.post("/addService", isAuth, (req, res) => {
  console.log(req.body);

  var form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    var bizApp;

    var businessName,
      businessIcon,
      bizMission,
      bizEmail,
      hqContinent,
      hqCountry,
      hqTown,
      hqAddress,
      bizRange,
      bizTopic,
      bizIntro,
      bizCat ,
      bizSus= null;

    var businessNameErr,
      businessIconErr,
      bizMissionErr,
      bizEmailErr,
      hqContinentErr,
      hqCountryErr,
      hqTownErr,
      hqAddressErr,
      bizRangeErr,
      bizTopicErr,
      bizIntroErr,
      bizCatErr = null;

    if (!err) {
      //business name

      if (fields.businessName.match(/^[a-zA-Z0-9.,!?-_\\\s]+$/)) {
        businessName = clean.CleanData(fields.businessName);
      } else {
        businessNameErr = "required letters and numbers only";
      }

      //business mission

      if (fields.businessMission.match(/^[a-zA-Z0-9\.\,\!\?\-\_\\\s]+$/)) {
        bizMission = clean.CleanData(fields.businessMission);
      } else {
        bizMissionErr = "required letters and numbers only";
      }

      //business introduction

      if (fields.businessIntro.match(/^[a-zA-Z0-9\.\,\!\?\-\_\\\s]+$/)) {
        bizIntro = clean.CleanData(fields.businessIntro);
      } else {
        bizIntroErr = "required letters and numbers only";
      }
      //business topic validation

      if (fields.businessTopic.match(/^[a-zA-Z0-9\.\,\!\?\-\_\\\s]+$/)) {
        bizTopic = clean.CleanData(fields.businessTopic);
      } else {
        bizTopicErr = "required letters and numbers only";
      }

      //business category validation

      if (fields.category.match(/^[0-9]{3}/)) {
        bizCat = fields.category;
      } else {
        bizCatErr = "required letters and numbers only";
      }

      //business email validation

      bizEmail = clean.CleanData(fields.businessEmail);

      //location validation

      if (
        fields.continent.match(/^[a-zA-Z0-9\s]+$/) &&
        fields.HQcountry.match(/^[a-zA-Z0-9\s]+$/) &&
        fields.HQcity.match(/^[a-zA-Z0-9\s]+$/) &&
        fields.range.match(/^[a-zA-Z0-9\.\,\!\?\-\_\s]+$/)
      ) {
        hqContinent = clean.CleanData(fields.continent);
        hqCountry = clean.CleanData(fields.HQcountry);
        hqTown = clean.CleanData(fields.HQcity);
        hqAddress = clean.CleanData(fields.HQaddress);
        bizRange = clean.CleanData(fields.range);
      } else {
        hqContinentErr = "Expected letters space and numbers only on location";
      }

      //brand image validation

      if (handleImageUpload(files)) {
        businessIcon = files.businessIcon.name;
      } else {
        businessIconErr = "invalid image type \n Expected .png, .jpg, .jpeg";
      }

      //handle socila media

      var social = {
        facebook: clean.CleanData(fields.facebook),
        instagram: clean.CleanData(fields.instagram),
        twitter: clean.CleanData(fields.twitter),
        linkedln: clean.CleanData(fields.linkedln),
        github: clean.CleanData(fields.github),
        youtube: clean.CleanData(fields.youtube),
      };
      var profileIg =
        businessName +
        "_" +
        Date.now() +
        "_" +
        Math.round(Math.random() * 1e9) +
        "." +
        businessIcon.split(".")[1];

      bizApp = {
        id: new Date() * Math.round(Math.random() * 1000),
        businessname: businessName,
        brandicon: profileIg,
        mission: bizMission,
        businessemail: bizEmail,
        continent: hqContinent,
        country: hqCountry,
        towncity: hqTown,
        address: hqAddress,
        range: bizRange,
        businesscategory: parseInt(bizCat),
        shortintro: bizIntro,
        shorttopic: bizTopic,
       
        facebook: social.facebook,
        instagram: social.instagram,
        twitter: social.twitter,
        youtube: social.youtube,
        linkedln: social.linkedln,
        github: social.github,
        owner : req.session.userDetails.username,
        suscription: fields.suscription,
        created_at : new Date(),
        operation: "insert",

        tablename: "BUSINESSAPP",
      };

      if (
        bizApp.address != null &&
        bizApp.brandicon != null &&
        bizApp.businesscategory != null &&
        bizApp.businessemail != null &&
        bizApp.businessname != null &&
        bizApp.continent != null &&
        bizApp.country != null &&
        bizApp.mission != null &&
        bizApp.range != null &&
        bizApp.shortintro != null &&
        bizApp.shorttopic != null &&
        bizApp.towncity != null
      ) {
        dbcon.run(bizApp).then(
          function (result) {
            if (result.code == 200) {
              var oldPath = files.businessIcon.path;

              var newPath =
                path.join(__dirname, "./../images") + "/" + profileIg;
              console.log(newPath);
              var rawData = fs.readFileSync(oldPath);

              fs.writeFileSync(newPath, rawData, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("image uploaded successfully");
                }
              });


              var insertOwner = {
                operation: "insert",
                tablename: "ownerbusiness",
                id: new Date() * Math.round(Math.random() * 10),
                username: req.session.userDetails.username,
                businessappid: bizApp.id,
              };

              dbcon.run(insertOwner).then(function (results) {
                if (results.code == 200) {
                  var email = {
                    from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                    to: req.session.userDetails.email,
                    subject: "Your Business App was created",
                    template: "appcreated",
                    context: {
                      appname: bizApp.businessname,
                      id: bizApp.id,
                      name: req.session.userDetails.username,
                      title: "App created",
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

                        req.session.appid = bizApp.id;
                        req.session.appname = bizApp.businessname;
                        res.redirect("/sdetailsa");
                      },
                      function (error) {
                        console.log(error);

                        req.session.appid = bizApp.id;
                        req.session.appname = bizApp.businessname;
                        res.redirect("/sdetailsa");
                      }
                    );
                } else {
                  var deleteApp = {
                    operation: "delete",
                    tablename: "businessapp",
                    wfield: "id",
                    wvalue: bizApp.id,
                  };

                  dbcon.run(deleteApp).then(function (results) {
                    console.log(results.result);

                    res.redirect("/AddService");
                  });
                }
              });
            } else {
              console.log(result.result);
              res.render("AddService/index", {
                error: "There was Error submitting... ",
                bizApp: bizApp,
              });
            }
          },
          function (err) {
            console.log(result.result);
            res.render("AddService/index", {
              error: "There was Error submitting... ",
              bizApp: bizApp,
            });
          }
        );
      } else {
        res.render("AddService/index", {
          businessIconErr: businessIconErr,
          bizCatErr: bizCatErr,
          bizEmailErr: bizEmailErr,
          bizMissionErr: bizEmailErr,
          bizIntroErr: bizIntroErr,
          bizRangeErr: bizRangeErr,
          bizTopicErr: bizTopicErr,
          hqContinentErr: hqContinentErr,
          businessNameErr: businessNameErr,
          businessName: bizApp.businessname,
          businessMission: bizMission,
          businessEmail: bizEmail,
          businessIntro: bizIntro,
          businessTopic: bizTopic,
          businessRange: bizRange,
          businessCountry: hqCountry,
          businessTown: hqTown,
          businessAddress: hqAddress,
        });
      }
    } else {
      console.log(err);
      res.send("error submiting form");
    }
  });
});

route.post("/saddservice", isbizSet, (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (!err) {
      var serviceIcon,
        serviceIconErr = null;

      if (handleserviceIconUpload(files)) {
        serviceIcon = files.serviceIcon.name;
      } else {
        serviceIconErr = "invalid image type \n Expected .png, .jpg, .jpeg";
      }

      let newservice = {

        created_at : new Date().toISOString(),
        id: new Date() * Math.round(Math.random() / Math.random()) * 10,

        servicename: clean.CleanData(fields.serviceName),
        serviceicon: serviceIcon,

        servicedesc: clean.CleanData(fields.serviceDesc),
        price: (+fields.servicePrice),

        businessid: req.session.appid,
        
        tablename: "services",

        operation: "insert",
      };

      var profileIg =
        newservice.servicename +
        "_" +
        Date.now() +
        "_" +
        Math.round(Math.random() * 1e9) +
        "." +
        newservice.serviceicon.split(".")[1];

      newservice.serviceicon = profileIg;
      newservice.created_at = new Date();

      // console.log(newservice);

      if (
        newservice.id != null &&
        newservice.servicedesc != null &&
        newservice.servicename != null &&
        newservice.price != null &&
        newservice.serviceicon != null && newservice.created_at != null
      ) {
        dbcon.run(newservice).then(function (results) {
          if (results.code == 200) {
            var oldPath = files.serviceIcon.path;

            var newPath = path.join(__dirname, "./../images") + "/" + profileIg;
            console.log(newPath);
            var rawData = fs.readFileSync(oldPath);

            fs.writeFileSync(newPath, rawData, function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("image uploaded successfully");
              }
            });

            res.render("servicedetails/index", {
              newService: " Service succcessfully submitted",
              serviceIconErr: serviceIconErr,
            });
          } else {
            console.log(results.result);

            res.render("servicedetails/index", {
              newService: " Error  submitting service...",
              serviceIconErr: serviceIconErr,
            });
          }
        });
      } else {
        res.render("servicedetails/index", {
          newService: " Error  submitting  Empty values...",
          serviceIconErr: serviceIconErr,
        });
      }
    }
  });
});

route.post("/saddlocation", isbizSet, (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (!err) {
      var hqContinent,
        hqCountry,
        hqTown,
        hqAddress,
        hqContinentErr = null;

      if (
        fields.branchContinent.match(/^[a-zA-Z0-9\s]+$/) &&
        fields.branchHQcountry.match(/^[a-zA-Z0-9\s]+$/) &&
        fields.branchHQcity.match(/^[a-zA-Z0-9\s]+$/)
      ) {
        hqContinent = clean.CleanData(fields.branchContinent);
        hqCountry = clean.CleanData(fields.branchHQcountry);
        hqTown = clean.CleanData(fields.branchHQcity);
        hqAddress = clean.CleanData(fields.branchHQaddress);
      } else {
        hqContinentErr = "Expected letters space and numbers only on location";
      }

      if (
        hqAddress != null &&
        hqContinent != null &&
        hqCountry != null &&
        hqTown != null &&
        req.session.appid != undefined
      ) {
        var location = {
          id: new Date() * Math.round(Math.random() * 10),
          businessappid: req.session.appid,
          continent: hqContinent,
          country: hqCountry,
          towncity: hqTown,
          address: hqAddress,
          tablename: "locations",

          operation: "insert",
        };

        dbcon.run(location).then(
          function (results) {
            if (results.code == 200) {
              res.render("AddService/location", {
                newLocation: "New Sub Location was successfully submitted",
              });
            } else {
              console.log(results.result);

              res.render("AddService/location", {
                newLocation: "There was error submitting the new sub location",
              });
            }
          },
          function (err) {}
        );
      } else {
        res.render("AddService/location", { newLocation: hqContinentErr });
      }
    } else {
      res.render("AddService/location", {
        newLocation: " Location succcessfully submitted",
      });
    }
  });
});

route.post("/addserviceimage", (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (!err) {
      var ImageIcon,
        ImageIconErr = null;

      if (handleserviceImagesUpload(files)) {
        ImageIcon = files.img.name;
      } else {
        ImageIconErr = "invalid image type \n Expected .png, .jpg, .jpeg";
      }

      if (ImageIcon != null) {
        var profileIg =
          req.session.appid +
          "_" +
          Date.now() +
          "_" +
          Math.round(Math.random() * 1e9) +
          "." +
          ImageIcon.split(".")[1];

        var newImage = {
          id: new Date() * Math.round(Math.random() * 20),

          businessappid: req.session.appid,

          imagelink: profileIg,

          created_at : new Date(),

          tablename: "businessimages",

          operation: "insert",
        };

        dbcon.run(newImage).then(function (results) {
          if (results.code == 200) {
            var oldPath = files.img.path;

            var newPath = path.join(__dirname, "./../images") + "/" + profileIg;
            console.log(newPath);
            var rawData = fs.readFileSync(oldPath);

            fs.writeFileSync(newPath, rawData, function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("image uploaded successfully");
              }
            });

            res.render("AddService/images", {
              newImage: "Service Image was submitted successfully...",
            });
          } else {
            console.log(results.result);
            res.render("AddService/images", {
              newImage:
                "Error occurred during images submission...\n please retry again",
            });
          }
        });
      }
    } else {
      res.render("AddService/images", {
        newImage:
          "Error occurred during images submission...\n please retry again",
      });
    }
  });
});
route.post("/addservicevideo", isbizSet, (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (!err) {
      var youtubeid = fields.youtubeVideo;

      var id;

      if (youtubeid.indexOf("&") != -1) {
        id = youtubeid.slice(
          youtubeid.indexOf("=") + 1,
          youtubeid.indexOf("&")
        );
      } else {
        id = youtubeid.slice(youtubeid.indexOf("=") + 1);
      }

      var newVideo = {
        id: new Date() * Math.round(Math.random() * 94),

        businessvideolink: id,

        businessappid: req.session.appid,

        created_at : new Date(),

        tablename: "businessvideos",

        operation: "insert",
      };

      if (
        newVideo.businessvideolink != null &&
        newVideo.businessappid != null &&
        newVideo.id != null
      ) {
        dbcon.run(newVideo).then(function (results) {
          if (results.code == 200) {
            res.render("AddService/videos", {
              newImage: "Video link was submitted sucessfully",
              businessName: req.session.appname,
            });
          } else {
            console.log(results.result);

            res.render("AddService/videos", {
              newImage:
                "Error occurred during video submission...\n please retry again",
              businessName: req.session.appname,
            });
          }
        });
      } else {
        res.render("AddService/videos", {
          newImage:
            "Error occurred during video submission...\n please retry again",
          businessName: req.session.appname,
        });
      }
    } else {
      res.render("AddService/videos", {
        newImage:
          "Error occurred during video submission...\n please retry again",
        businessName: req.session.appname,
      });
    }
  });
});

route.post("/updateapprate", (req, res) => {
  var startUpdate = {
    id: new Date() * Math.round(Math.random() * 100),

    username: clean.CleanData(req.body.loggeduser),

    businessappid: parseInt(clean.CleanData(req.body.appid)),

    ratingno: parseInt(clean.CleanData(req.body.starno)),

    created_at : new Date(),

    tablename: "ratings",

    operation: "insert",
  };

  if (
    startUpdate.businessappid != null &&
    startUpdate.businessappid != undefined &&
    startUpdate.id != null &&
    startUpdate.id != undefined &&
    startUpdate.ratingno != null &&
    startUpdate.ratingno != undefined &&
    startUpdate.username != null &&
    startUpdate.username != undefined
  ) {
    console.log(startUpdate.ratingno);

    dbcon.run(startUpdate).then(function (results) {
      if (results.code == 200) {
        var ratingquery = {
          tablename: "ratings",
          operation: "select",

          fields: [],

          wfield: ["businessappid"],

          wvalue: [startUpdate.businessappid],
        };
        dbcon.run(ratingquery).then(function (results) {
          if (results.code == 200) {
            var totaluser = results.result.rows.length;

            var ratings = results.result.rows;

            var totalratings = 0;

            ratings.forEach((element) => {
              totalratings = totalratings + element.RATINGNO;
            });

            var averagerating = Math.round(totalratings / totaluser);

            res.send({ code: 200, result: averagerating });
          } else {
            res.send({ code: 101, result: "Error getting ratings" });
          }
        });
      } else {
        console.log(results.result);
        res.send({ code: 101, result: "Error ocuured ..." });
      }
    });
  } else {
    res.send({ code: 101, result: "Error ocuured ..." });
  }
});

route.post("/placeorder", (req, res) => {

  console.log(req.body)

  if (req?.session?.isAuth === true) {
  var order = {
    id: new Date() * Math.round(Math.random() * 8),

    username: req.session.userDetails.username,
    serviceid: parseInt(clean.CleanData(req.body.serviceid)),
  
    quantity: 1,

    checkedout: 0,

    created_at : new Date(),

    type : clean.CleanData(req.body.type),

    status : 1,

    tablename: "bookings",

    operation: "insert",
  };

  var orderAppid = {
    operation: "select",
    tablename: "services",

    fields: [],

    wfield: ["id"],

    wvalue: [order.serviceid],
  };

  dbcon.run(orderAppid).then(function (results) {
    if (results.code == 200) {
      var appid = results.result.rows[0].BUSINESSID;

      var ordersdet = {
        id: new Date() * Math.round(Math.random() * 8),

        username: req?.session?.userDetails?.username,
        serviceid: parseInt(clean.CleanData(req.body.serviceid)),

        quantity: 1,

        checkedout: 0,

        businessappid: appid,

        created_at : new Date(),

        type : clean.CleanData(req.body.type),


    status : 1,

        tablename: "bookings",

        operation: "insert",
      };

      if (
        order.id != null &&
        order.id != undefined &&
        order.serviceid != null &&
        order.serviceid != undefined &&
        order.username != null &&
        order.username != undefined
      ) {
        dbcon.run(ordersdet).then(function (results) {
          if (results.code == 200) {
            res.send({ code: 200 });
          } else {
            console.log(results.result);
            res.send({ code: 101 });
          }
        });
      } else {
        console.log("An empty field..");
        res.send({ code: 101 });
      }
    } else {
      res.send({ code: 102, error: "service id doesnt exist" });
    }
  });
}else{

  res.send({ code: 309, result: "Please Login to continue" });

}
});

route.post("/updateorder",isAuth, (req, res) => {
  var option = clean.CleanData(req.body.option);

  var quantity = parseInt(req.body.quantity);

  if (option.match("add")) {
    quantity++;
  } else if (option.match("minus")) {
    quantity--;
  } else {
    quantity = null;
  }
  var updateorder = {
    operation: "update",
    tablename: "bookings",

    quantity: quantity,

    where: "id",
    val: parseInt(req.body.id),
  };
  if (updateorder.val != null && updateorder.val != undefined) {
    dbcon.run(updateorder).then(function (results) {
      if (results.code == 200) {
        res.send({ code: 200, result: quantity });
      } else {
        console.log(results.result);
        res.send({ code: 101 });
      }
    });
  } else {
    console.log("An empty field..");
    res.send({ code: 101 });
  }
});

route.post("/checkoutorder", isAuth, (req, res) => {
  var orderid = clean.CleanData(req.body.orderid);

  console.log(orderid);

  if (orderid != null && orderid != undefined) {
    var updatecheckOrder = {
      operation: "update",
      tablename: "bookings",

      checkedout: 1,

      where: "id",
      val: parseInt(orderid),
    };

    dbcon.run(updatecheckOrder).then(function (results) {
      if (results.code == 200) {
        res.send({ code: 200 });
      } else {
        res.send({ code: 101 });
      }
    });
  }
});

route.post("/deleteorder",isAuth, (req, res) => {
  var orderid = clean.CleanData(req.body.orderid);

  console.log(orderid);

  if (orderid != null && orderid != undefined) {
    var deleteOrder = {
      tablename: "bookings",
      operation: "update",
      satatus : 0,
      where: "id",
      val: parseInt(orderid),
    };

    dbcon.run(deleteOrder).then(function (results) {
      if (results.code == 200) {
        res.send({ code: 200 });
      } else {
        res.send({ code: 101 });
      }
    });
  }
});

route.post("/deletecartorder", isAuth, (req, res) => {
  var orderid = clean.CleanData(req.body.orderid);
  var useremail = clean.CleanData(req.body.email);
  var username = clean.CleanData(req.body.username)
  var businessname = clean.CleanData(req.body.businessname)
  var servicename = clean.CleanData(req.body.servicename)


  if (orderid != null && orderid != undefined) {
    var deleteOrder = {
      tablename: "ordercart",
      operation: "update",
      status : 'cancelled',
      where: "orderid",
      val: parseInt(orderid),
    };

    dbcon.run(deleteOrder).then(function (results) {
      if (results.code == 200) {
        var email = {
          from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
          to: useremail,
          subject: `Your Order or Service for ${servicename} by ${businessname} has been Cancelled`,
          template: "orderTemp",
          context: {
            name: username,

            appname: businessname,

            replyto: 'fizzbiznet@gmail.com',

            content: `Your Order or Service for ${servicename} by ${businessname} has been Cancelled. \n`,

            title: "Order or Service Cancelled",
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
              res.send({ code: 200, result: "result" });
              console.log(result);
            },
            function (error) {
              console.log(error);
            }
          );

      } else {
        res.send({ code: 101 });
      }
    });
  }
});

route.post("/completecartorder", isAuth, (req, res) => {
  var orderid = clean.CleanData(req.body.orderid);
  var useremail = clean.CleanData(req.body.email);
  var username = clean.CleanData(req.body.username)
  var businessname = clean.CleanData(req.body.businessname)
  var servicename = clean.CleanData(req.body.servicename)



  console.log(orderid, " : ", useremail , " : ", username, " : ", businessname, " : ", servicename);

  if (orderid != null && orderid != undefined) {
    var deleteOrder = {
      tablename: "ordercart",
      operation: "update",
      status : 'completed',
      where: "orderid",
      val: parseInt(orderid),
    };

    dbcon.run(deleteOrder).then(function (results) {
      if (results.code == 200) {
        // res.send({ code: 200 });

        var email = {
          from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
          to: useremail,
          subject: `Your Order or Service for ${servicename} by ${businessname} has been successfully completed`,
          template: "orderTemp",
          context: {
            name: username,

            appname: businessname,

            replyto: 'fizzbiznet@gmail.com',

            content: `Your Order or Service for ${servicename} by ${businessname} has been successfully completed. \n If you have 
            not received the order or service please contact us.`,

            title: "Order or Service Completed",
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
              res.send({ code: 200, result: "result" });
              console.log(result);
            },
            function (error) {
              console.log(error);
            }
          );


        ////...................
      } else {
        res.send({ code: 101 });
      }
    });
  }
});

route.post("/postcomment", isAuth, (req, res) => {
  var commment = {
    id: new Date() * Math.round(Math.random() * 30),

    businessreviews: clean.CleanData(req.body.comment),

    username: clean.CleanData(req.body.username),

    businessappid: parseInt(req.body.appid),

    profileimage: clean.CleanData(req.body.profileimage),

    created_at : new Date(),

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
      if (results.code == 200) {
        var commentquery = {
          tablename: "businessreviews",
          operation: "select",

          fields: [],

          wfield: ["businessappid"],

          wvalue: [commment.businessappid],
        };

        dbcon.run(commentquery).then(function (results) {
          if (results.code == 200) {
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

route.post("/postemail", isAuth, (req, res) => {
  var newemail = {
    content: clean.CleanData(req.body.content),

    email: clean.CleanData(req.body.email),

    appname: clean.CleanData(req.body.appname),

    topic: clean.CleanData(req.body.topic),

    username: clean.CleanData(req.body.username),

    appemail: clean.CleanData(req.body.appemail),

    appid: parseInt(req.body.appid),
  };

  var checkifnull = false;
  for (const key in newemail) {
    if (newemail.hasOwnProperty(key)) {
      const element = newemail[key];

      if (element == null || element == undefined) {
        checkifnull = true;
      }
    }
  }

  if (checkifnull) {
    res.send({ code: 101, result: "Empty Field" });
  } else {
    var selectOwner = {
      operation: "select",
      tablename: "ownerbusiness",

      fields: [],

      wfield: ["username", "businessappid"],

      wvalue: [newemail.username, newemail.appid],
    };

    dbcon.run(selectOwner).then(function (results) {
      if (results.code == 200) {
        if (results.result.rows.length != 0) {
          console.log("owner found");
          var selectFollowers = {
            operation: "select",
            tablename: "followers",

            fields: [],

            wfield: ["businessappid"],

            wvalue: [newemail.appid],
          };

          dbcon.run(selectFollowers).then(function (results) {
            if (results.code == 200) {
              var followers = results.result.rows;

              console.log(followers.length);

              if (followers.length == 0) {
                return res.send({ code: 402 });
              }
              followers.map((follower) => {
                var getEmail = follower.USEREMAIL;

                var getUsername = follower.USERNAME;

                console.log(getEmail);

                var email = {
                  from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                  to: getEmail,
                  subject: newemail.topic,
                  template: "comment",
                  context: {
                    name: newemail.appname,

                    appname: getUsername,

                    replyto: newemail.appemail,

                    content: newemail.content,

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
                    },
                    function (error) {
                      console.log(error);
                    }
                  );

                setTimeout(function () {
                  res.send({
                    code: 200,
                    result: "sending message successfull",
                  });
                }, 3000);
              });
            } else {
              var email = {
                from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                to: newemail.appemail,
                subject: newemail.topic,
                template: "comment",
                context: {
                  name: newemail.username,

                  appname: newemail.appname,

                  replyto: newemail.email,

                  content: newemail.content,

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
                    res.send({ code: 200, result: "result" });
                    console.log(result);
                  },
                  function (error) {
                    console.log(error);
                  }
                );
            }
          });
        } else {
          var email = {
            from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
            to: newemail.appemail,
            subject: newemail.topic,
            template: "comment",
            context: {
              name: newemail.username,

              appname: newemail.appname,

              replyto: newemail.email,

              content: newemail.content,

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
                res.send({ code: 200, result: "result" });
                console.log(result);
              },
              function (error) {
                console.log(error);
              }
            );
        }
      } else {
        var email = {
          from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
          to: newemail.appemail,
          subject: newemail.topic,
          template: "comment",
          context: {
            name: newemail.username,

            appname: newemail.appname,

            replyto: newemail.email,

            content: newemail.content,

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
              res.send({ code: 200, result: "result" });
              console.log(result);
            },
            function (error) {
              console.log(error);
            }
          );
      }
    });
  }
});


route.post("/post/private/email", isAuth, (req, res) => {
  var newemail = {
    content: clean.CleanData(req?.body?.content),

    email: clean.CleanData(req?.body?.email),


    topic: clean.CleanData(req?.body?.topic),

    username: clean.CleanData(req?.body?.username),

    senderemail: req?.session?.userDetails?.email,

    sendername: req?.session?.userDetails?.username,
  };

  console.log(newemail)

  var checkifnull = false;
  for (const key in newemail) {
    if (newemail.hasOwnProperty(key)) {
      const element = newemail[key];

      if (element == null || element == undefined) {
        checkifnull = true;
      }
    }
  }

  if (checkifnull) {
    res.send({ code: 101, result: "Empty Field" });
  } else {
  
                var email = {
                  from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                  to: newemail.email,
                  subject: newemail.topic,
                  template: "privateChat",
                  context: {
                    sendername: newemail.sendername,

                    receivername: newemail.username,

                    replyto: newemail.senderemail,

                    content: newemail.content,

                    title: "Private Chat Log",
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
                    },
                    function (error) {
                      console.log(error);
                    }
                  );

                setTimeout(function () {
                  res.send({
                    code: 200,
                    result: "sending message successfull",
                  });
                }, 1500);
  }
  }
);

route.post("/postlike", (req, res) => {
  var appid = parseInt(req.body.appid);
  var appcat = parseInt(req.body.cat);


  var newLike = {
    id: new Date() * Math.round(Math.random() * 17),
    username: req?.session?.userDetails?.username,
    businessappid: appid,
    appname: clean.CleanData(req.body.appname),
    appimage: req.body.appimage,
    created_at : new Date(),
    category : appcat,
    tablename: "applikes",
    operation: "insert",
  };

    if (req?.session?.isAuth === true) {
    dbcon.run(newLike).then(function (results) {
      console.log(results.result)
      if (results.code == 200) {
        
        res.send({ code: 200, result: "Like successful" });
      } else {
        res.send({ code: 101, result: "already liked" });
      }
    });

  }else{

    res.send({ code: 101, result: "Please Login to continue" });

  }
  
});

route.post("/postfollow", (req, res) => {
  var appid = parseInt(req.body.appid);

  if (req?.session?.isAuth === true) {

  var newLike = {
    id: new Date() * Math.round(Math.random() * 17),
    username: req?.session?.userDetails?.username,
    businessappid: appid,
    appname: clean.CleanData(req.body.appname),
    appimage: req.body.appimage,
    useremail: req.session.userDetails.email,
    created_at : new Date(),
    tablename: "followers",
    operation: "insert",
  };

  if (
    newLike.id != null &&
    newLike.id != undefined &&
    newLike.username != null &&
    newLike.username != undefined &&
    newLike.businessappid != null &&
    newLike.businessappid != undefined
  ) {
    dbcon.run(newLike).then(function (results) {
      if (results.code == 200) {
        res.send({ code: 200, result: "Followed successfully" });
      } else {
        res.send({ code: 101, result: "Already Following." });
      }
    });
  } else {
    res.send({ code: 101, result: "Error Following" });
  }
}else{

  res.send({ code: 101, result: "Please Login to continue" });

}
});

route.post("/handleorder", isAuth, (req, res) => {

  console.log('triggered')
  var orderdetails = {
    orderid: parseInt(clean.CleanData(req.body.orderid)),

    username: clean.CleanData(req.body.username),
    appid: parseInt(clean.CleanData(req.body.appid)),

    serviceid: parseInt(clean.CleanData(req.body.serviceid)),
    venue: clean.CleanData(req.body.venueorder),
    datetimeorder: clean.CleanData(req.body.datetime),
    created_at : new Date(),
    status : 'pending',
    type: clean.CleanData(req.body.type),
    id: new Date() * Math.round(Math.random() * 13),


    operation: "insert",
    tablename: "ordercart",
  };

  dbcon.run(orderdetails).then((result)=>{


    if(result.code === 200){

      var appname = clean.CleanData(req.body.businessname),
      appemail = clean.CleanData(req.body.businessemail),
      servicename = clean.CleanData(req.body.servicename),
      serviceImage = clean.CleanData(req.body.serviceimage),
      useremail = clean.CleanData(req.body.email);
  
  
                  var newemail = {
                    useremail: useremail,
  
                    serviceicon: serviceImage,
  
                    topic: "Your Order service details",
  
                    username: orderdetails.username,
  
                    appemail: appemail,
  
                    appname: appname,
                  };
  
                  var checkifnull = false;
                  for (const key in newemail) {
                    if (newemail.hasOwnProperty(key)) {
                      const element = newemail[key];
  
                      if (element == null || element == undefined) {
                        checkifnull = true;
                      }
                    }
                  }
  
                  if (checkifnull) {
                    res.send({ code: 101, result: "Empty Field" });
                  } else {
                    var email = {
                      from: `${newemail.appname}  <fizzbiznet@gmail.com>`,
                      to: newemail.useremail,
                      subject: newemail.topic,
                      template: "orderemail",
                      context: {
                        username: newemail.username,
                        appname: newemail.appname,
                      servicename : servicename,
                        title: "Order Details Email",
                        datetime: orderdetails.datetimeorder,
                        venue: orderdetails.venue,
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
                          filename: newemail.serviceicon,
                          path: path.join(
                            __dirname,
                            "./../images/" + newemail.serviceicon
                          ),
                          cid: "serviceicon", //same cid value as in the html img src
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
                          var delOrder = {
                            operation: "update",
                            tablename: "bookings",
                            checkedout : 1,
                            satatus : 0,
                            where: "id",
                            val: orderdetails.orderid,
                          };
  
                          dbcon.run(delOrder).then(function (results) {
                            if (results.code == 200) {
                              // dbcon.run(orderdetails).then(function (results) {  
                              //   if (results.code == 200) {
                              //     res.send({ code: 200, result: "result" });
                              //   } else {
                              //     console.log("Error updating bookings : ", results.result);
                              //     res.send({
                              //       code: 108,
                              //       error: "Error handling insertion to cart...",
                              //     });
                              //   }
                              // });
                              res.send({ code: 200, result: "result" });
                            }else {
                              console.log("Error deleting order", results.result);
                              res.send({
                                code: 107,
                                error: "Error handling delete order",
                              });
                            }
                          });
                        },
                        function (error) {
                          console.log(error);
  
                          res.send({ code: 101, error: "error" });
                        }
                      );
                  }
  


    }else{

      res.send({ code: 101, error: "error" });


    }

              }).catch(error=>{

                console.log(error)

                res.send({ code: 101, error: "error" });


              })
          
});

module.exports = route;

function handleImageUpload(files) {
  if (!files.businessIcon) {
    return false;
  } else {
    let ext = files.businessIcon.name.split(".")[1].toLowerCase();

    if (ext.match("png") || ext.match("jpg") || ext.match("jpeg")) {
      return true;
    } else {
      return false;
    }
  }
}

function handleserviceIconUpload(files) {
  if (!files.serviceIcon) {
    return false;
  } else {
    let ext = files.serviceIcon.name.split(".")[1].toLowerCase();

    if (ext.match("png") || ext.match("jpg") || ext.match("jpeg")) {
      return true;
    } else {
      return false;
    }
  }
}

function handleserviceImagesUpload(files) {
  if (!files.img) {
    return false;
  } else {
    let ext = files.img.name.split(".")[1].toLowerCase();

    if (ext.match("png") || ext.match("jpg") || ext.match("jpeg")) {
      return true;
    } else {
      return false;
    }
  }
}
