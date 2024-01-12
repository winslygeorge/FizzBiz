const { parse } = require("cookie");
const express = require("express");
const oracledb = require('oracledb');
const clean = require("../databasemanagementMYSQL/clean");
const route = express.Router();

const db = require("./../../oracleDBManager/dbmanager");
const QueryFunctionData = require("./reduxData/fetchAppData");

const connection = require("./../../oracleDBManager/dbconnect");
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
      
      if (results.result.rows.length > 0) {
        
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






route.get('/search/apps/:id', (req, res)=>{

  var catid = req.params.id;

var searchid = `%${req?.query?.search}%`

console.log(catid, searchid)

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

        searchFields : ['businessname', 'mission', 'address', 'businesscategory', 'continent', 'country', 'towncity', 'range', 'shortintro', 'shorttopic', 'owner'],
        searchValue : [searchid, searchid,searchid,searchid,searchid,searchid,searchid,searchid,searchid,searchid,searchid,]
        
      };

      console.log(appsquery)

      dbcon.run(appsquery).then(function (results) {

        console.log(results)
        if (results &&  results.code == 200) {
          var apps = results.result.rows;
         

          var appcounter = 0;

          while (appcounter < apps.length) {
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

          res.send( {code : 200 , results : {
            loggedUser: req.session.userDetails,
            appscat: catsapps,
            apps
          }} );

        }else{

          res.send({code: 400, message:`No Record Found with the search id: ${searchid}`})
        }
      })

    }

  }

})



route.get("/search/usersorders/:id", isMyprofile, (req, res) => {
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
      if (results &&  results.code == 200) {
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

route.get("/search/businessorders/:id", isAdmin, (req, res) => {
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

route.get("/search/businesscartorders/:id", isAdmin,(req, res) => {

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

module.exports = route;
