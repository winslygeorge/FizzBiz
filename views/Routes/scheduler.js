const express = require('express')

const formidable = require('formidable')

const clean = require('./../databasemanagementMYSQL/clean')

const db = require('./../../oracleDBManager/dbmanager')

const genEmail = require('./../../email/genSendEmail')
const optionGen = require('./../../email/emailoptionsgenerator')
const options = new optionGen()


const gen = new genEmail()

const path = require('path')

const fs = require('fs')
const { cleanData } = require('jquery')
const { CleanData } = require('./../databasemanagementMYSQL/clean')

const dbcon = new db()

const route = express.Router()

const isbizSet = (req, res, next) => {

    if (req.session.appid != null && req.session.appid != undefined && req.session.isAuth) {

        next()
    } else {

        res.redirect('/AddService')
    }
}

const isAppID = (req, res, next) => {

    if (req.session.appid != null && req.session.appid != undefined) {

        next()
    } else {

        res.redirect('/AddService')
    }
}

const isAuth = (req, res, next) => {

    if (req.session.isAuth) {

        next()
    } else {

        res.render('/login')
    }
}

route.post('/retrieve-schedules',  (req, res) => {

    console.log(req.query)

    var username = CleanData(req?.query?.username)
    var appid = parseInt(CleanData(req?.query?.appid))
    var orderid = parseInt(CleanData(req?.query?.orderid))
    var role = CleanData(req?.query?.role)

    var changed = req?.body?.changed

    if(changed?.length > 0){

        changed?.map((element, index)=>{


            var updateevent = {
            
                operation: 'update',
                tablename: 'eventtable',
                SUBJECT: element?.SUBJECT ? element?.SUBJECT : null,
                LOCATION: element?.LOCATION ? element?.LOCATION : null,
                START_TIME: element?.START_TIME ? new Date(element?.START_TIME) : null,
                END_TIME: element?.END_TIME ? new Date(element?.END_TIME) : null,
                DESCRIPTION: element?.DESCRIPTION ? element?.DESCRIPTION : null,
                OWNER:element?.OWNER ? element?.OWNER : 1,
                PRIORITY: element?.PRIORITY ? element?.PRIORITY : null,
                RECURRENCE: element?.RECURRENCE ? element?.RECURRENCE : 1,
                RECURRENCE_TYPE: element?.RECURRENCE_TYPE ? element?.RECURRENCE_TYPE : null,
                RECURRENCE_TYPE_COUNT: element?.RECURRENCE_TYPE_COUNT ? element?.RECURRENCE_TYPE_COUNT : null,
                REMINDER: element?.REMINDER ? element?.REMINDER : null,
                CATEGORIZE: element?.CATEGORIZE ?  element?.CATEGORIZE : null,
                CUSTOM_STYLE:  element?.CUSTOM_STYLE ? element?.CUSTOM_STYLE : null,
                ALL_DAY: `${element?.ALL_DAY}` ? `${element?.ALL_DAY}` : false,
                RECURRENCE_START_DATE: element?.RECURRENCE_START_DATE ? element?.RECURRENCE_START_DATE : null,
                RECURRENCE_END_DATE: element?.RECURRENCE_END_DATE ? element?.RECURRENCE_END_DATE : null,
                RECURRENCE_RULE: element?.RECURRENCE_RULE ? element?.RECURRENCE_RULE : null ,
                START_TIME_ZONE: element?.START_TIME_ZONE ? element?.START_TIME_ZONE : null ,
                END_TIME_ZONE: element?.END_TIME_ZONE ?element?.END_TIME_ZONE :  null,
                where: 'ID',
                val : element?.ID,

            }
    
           
                
                dbcon.run(updateevent).then(function (results) {
    
                    if (results && results.code == 200) {
    
                        console.log(results.result)
                    } else {
    
                        console.log(results.result)
    
                    }
                })


        
    })
    }

    var deleted = req?.body?.deleted

    if(deleted?.length > 0){

        deleted?.map((element, index)=>{


    var deleteevent = {

        operation: 'delete',
        tablename: 'eventtable',
        wfield: "id",
        wvalue: parseInt(element?.ID)
    }
  
                dbcon.run(deleteevent).then(function (results) {
    
                    if (results && results.code == 200) {
    
                        console.log(results.result)
                    } else {
    
                        console.log(results.result)
    
                    }
                })


        
    })

    }

    var added = req?.body?.added

    if(added?.length > 0){

        added?.map((element, index)=>{


            var addScedule = {
            
                operation: 'insert',
                tablename: 'eventtable',
                    ID: element?.ID ? element?.ID * Math.random(100) * new Date() : null,
                    SUBJECT: element?.SUBJECT ? element?.SUBJECT : null,
                    LOCATION: element?.LOCATION ? element?.LOCATION : null,
                    START_TIME: element?.START_TIME ? new Date(element?.START_TIME) : null,
                    END_TIME: element?.END_TIME ? new Date(element?.END_TIME) : null,
                    DESCRIPTION: element?.DESCRIPTION ? element?.DESCRIPTION : null,
                    OWNER:element?.OWNER ? element?.OWNER : 1,
                    PRIORITY: element?.PRIORITY ? element?.PRIORITY : null,
                    RECURRENCE: element?.RECURRENCE ? element?.RECURRENCE : 1,
                    RECURRENCE_TYPE: element?.RECURRENCE_TYPE ? element?.RECURRENCE_TYPE : null,
                    RECURRENCE_TYPE_COUNT: element?.RECURRENCE_TYPE_COUNT ? element?.RECURRENCE_TYPE_COUNT : null,
                    REMINDER: element?.REMINDER ? element?.REMINDER : null,
                    CATEGORIZE: element?.CATEGORIZE ?  element?.CATEGORIZE : null,
                    CUSTOM_STYLE:  element?.CUSTOM_STYLE ? element?.CUSTOM_STYLE : null,
                    ALL_DAY: `${element?.ALL_DAY}` ? `${element?.ALL_DAY}` : false,
                    RECURRENCE_START_DATE: element?.RECURRENCE_START_DATE ? element?.RECURRENCE_START_DATE : null,
                    RECURRENCE_END_DATE: element?.RECURRENCE_END_DATE ? element?.RECURRENCE_END_DATE : null,
                    RECURRENCE_RULE: element?.RECURRENCE_RULE ? element?.RECURRENCE_RULE : null ,
                    START_TIME_ZONE: element?.START_TIME_ZONE ? element?.START_TIME_ZONE : null ,
                    END_TIME_ZONE: element?.END_TIME_ZONE ?element?.END_TIME_ZONE :  null,
                    USERNAME : username ?? null,
                    APPID : appid > 0 ? appid : null,
                    SERVICEID : orderid > 0 ? orderid : null
                    
                }
               
            
    
            
                
              dbcon.run(addScedule).then(function (results) {
    
                    if (results && results.code == 200) {

    //                     setTimeout(function(){


    //                         var email = {
    //                           from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
    //                           to: inputs.email,
    //                           subject: "Verify Your Email",
    //                           template: "verify",
    //                           context: {
    //                             name: inputs.username,
    //                             url: "YOUR URL",
    //                             title: "Verify Email",
    //                             code: code,
    //                           },
   
    //                           attachments: [
    //                             {
    //                               filename: "FizzBizNet.png",
    //                               path: path.join(
    //                                 __dirname,
    //                                 "./../../email/views/images/FizzBizNet.png"
    //                               ),
    //                               cid: "logoimg", //same cid value as in the html img src
    //                             },
    //                             {
    //                               filename: inputs.profileImage,
    //                               path: path.join(
    //                                 __dirname,
    //                                 "./../images/" + inputs.profileImage
    //                               ),
    //                               cid: "profileicon", //same cid value as in the html img src
    //                             },
    //                           ],
    //                         };
   
    //                         gen
    //                           .sendMail(
    //                             options.generateEmailOpt(
    //                               email.from,
    //                               email.to,
    //                               email.subject,
    //                               email.template,
    //                               email.context,
    //                               email.attachments
    //                             )
    //                           )
    //                           .then(
    //                             function (result) {
    //                                   console.log(result);
                                      
    //  res.redirect("/emailverification");                             },
    //                             function (error) {
    //                                 console.log(error);
    //                                   res.redirect("/emailverification");
    //                             }
    //                           );
   
   
    //                    }, 3000)
   
    console.log(results.result)
                    } else {

                        console.log(results.result)
    
    
                    }
                })
            })
        }

    var getSchedules = role === 'adminsched' ? {
            operation: 'select',
            tablename: 'eventtable',
            fields: [],
            wfield : ['APPID'],
            wvalue : [appid]

    } : {
        operation: 'select',
        tablename: 'eventtable',
        fields: [],
        wfield : ['USERNAME'],
        wvalue : [username]
    }

  
        
        dbcon.run(getSchedules).then(function (results) {

            var  finalRes = []
            
            if (results && results.code == 200) {

                finalRes = results.result.rows

                finalRes?.map((e, index)=>{

                    e['ALL_DAY'] = e['ALL_DAY'] === "true" ? true : false

                })
                
                res.send(finalRes)

            } else {
                
res.send(results.result.rows)
            }
        })
    


})


route.post('/create-schedules',  (req, res) => {

    console.log(req.body)

    var getSchedules = {
        operation: 'select',
        tablename: 'eventtable',
        fields: [],
        wfield: ['id'],

        wvalue: ['103'],
    }

  
        
//         dbcon.run(getSchedules).then(function (results) {
            
//             if (results.code == 200) {
                
//                 res.send(results.result.rows)

//             } else {
                
// res.send(results.result.rows)
//             }
//         })
    
res.send({status: 200, message: "success"})


})
module.exports = route;