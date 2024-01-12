const express = require('express')
const { password } = require('../../oracleDBManager/dbconfig')
const oracledb =  require('./../../oracleDBManager/dbmanager')

const bycrypt = require('bcrypt')

const Clean = require('./../databasemanagementMYSQL/clean')

const route = express.Router()

route.get('/loginUser', (req, res)=>{
let db =  new oracledb()
var userCredidentials;
if(req.query.userName.indexOf('@') != -1){


    userCredidentials = {

        tablename : "users",
    
        operation : "select",
    
        fields : [],
        wfield : ["email"],
        wvalue : [Clean.CleanData(req.query.userName)]
    }
 
}else{

    userCredidentials = {

        tablename : "users",
    
        operation : "select",
    
        fields : [],
        wfield : ["username"],
        wvalue : [req.query.userName]
    }

}

db.run( userCredidentials).then(function(feedback){

    if (feedback && feedback.code == 200) {
        
        if (feedback.result.rows.length == 0) {

            res.redirect('/login')
            
        }else{


            let passd = feedback.result.rows[0].PASSWORD

            var isverified = feedback.result.rows[0].ISVERIFIED

            console.log(isverified)
            
            if (isverified == 1) {
                

                if (bycrypt.compareSync(req.query.passwd, passd)) {
                    req.session.isAuth = true;

                    req.session.userDetails = {
                        username: feedback.result.rows[0].USERNAME,
                        email: feedback.result.rows[0].EMAIL,
                        profileimage: feedback.result.rows[0].PROFILEIMAGE,
                    };

                    res.redirect("/apps/all");
                } else {
                    res.redirect("/login");
                }

            } else {
                
                res.redirect("/emailverification")
            }


       
      
        }

       

     
    }else{

        console.log(feedback.code)

        res.redirect('/login')
    }
})


})

route.get('/googleLoginUser', (req, res)=>{
    let db =  new oracledb()
    var userCredidentials;
    if(req.query.userName.indexOf('@') != -1){
    
    
        userCredidentials = {
    
            tablename : "users",
        
            operation : "select",
        
            fields : [],
            wfield : ["email"],
            wvalue : [Clean.CleanData(req.query.userName)]
        }
     
    }else{
    
        userCredidentials = {
    
            tablename : "users",
        
            operation : "select",
        
            fields : [],
            wfield : ["username"],
            wvalue : [req.query.userName]
        }
    
    }
    
    db.run( userCredidentials).then(function(feedback){
    
        if (feedback && feedback.code == 200) {
            
            if (feedback.result.rows.length == 0) {

                res.send({code: 309})
    
                
            }else{
    
    
                let passd = feedback.result.rows[0].PASSWORD
    
                var isverified = feedback.result.rows[0].ISVERIFIED
    
                console.log(isverified)
                
                if (isverified == 1) {

                    res.send({code: 200})
    
                } else {

                    res.send({code: 308})
                    
                   
                }
    
    
           
          
            }
    
           
    
         
        }else{
    
            console.log(feedback.code)
    
            res.send({code : 101})
        }
    })
    
    
    })
    

module.exports = route