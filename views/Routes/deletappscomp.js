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

        res.redirect('/login')
    }
}

route.post('/deleteappservice', isAuth, (req, res) => {
    
    var deleteService = {

        operation: 'delete',
        tablename: 'services',
        wfield: "id",
        wvalue: parseInt(req.body.serviceid)
    }

    

    dbcon.run(deleteService).then(function (results) {
        
        if (results && results.code == 200) {


            
            res.send({code : 200})

        } else {

            console.log(results.result)
            
            res.send({code : 101})
        }
    })
})


route.post('/deleteapplocation', isAuth, (req, res) => {

    var deleteService = {

        operation: 'delete',
        tablename: 'locations',
        wfield: "id",
        wvalue: parseInt(req.body.id)
    }



    dbcon.run(deleteService).then(function (results) {

        if (results && results.code == 200) {



            res.send({ code: 200 })

        } else {

            console.log(results.result)

            res.send({ code: 101 })
        }
    })
})


route.post('/deleteappimage', isAuth, (req, res) => {

    var deleteService = {

        operation: 'delete',
        tablename: 'businessimages',
        wfield: "id",
        wvalue: parseInt(req.body.id)
    }



    dbcon.run(deleteService).then(function (results) {

        if (results && results.code == 200) {



            res.send({ code: 200 })

        } else {

            console.log(results.result)

            res.send({ code: 101 })
        }
    })
})



route.post('/deleteappvideo', isAuth, (req, res) => {

    var deleteService = {

        operation: 'delete',
        tablename: 'businessvideos',
        wfield: "id",
        wvalue: parseInt(req.body.id)
    }



    dbcon.run(deleteService).then(function (results) {

        if (results && results.code == 200) {



            res.send({ code: 200 })

        } else {

            console.log(results.result)

            res.send({ code: 101 })
        }
    })
})


route.post('/updatetopic', isAuth, (req, res) => {

    var updateMission = {

        shorttopic: req.body.topic,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.shorttopic != null && updateMission.shorttopic != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200 , result : updateMission.shorttopic})

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updatecontinent', isAuth, (req, res) => {

    var updateMission = {

        continent: req.body.continent,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.continent != null && updateMission.continent != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.continent })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updatecountry', isAuth, (req, res) => {

    var updateMission = {

        country: req.body.country,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.country != null && updateMission.country != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && 
                results.code == 200) {

                res.send({ code: 200, result: updateMission.country })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updatetown', isAuth, (req, res) => {

    var updateMission = {

        towncity: req.body.town,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.towncity != null && updateMission.towncity != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.towncity })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updateaddress', isAuth, (req, res) => {

    var updateMission = {

        address: req.body.address,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.address != null && updateMission.address != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.address })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updatefacebook', isAuth, (req, res) => {

    var updateMission = {

        facebook: req.body.facebook,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.facebook != null && updateMission.facebook != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.facebook })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updateinstagram', isAuth, (req, res) => {

    var updateMission = {

        instagram: req.body.instagram,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.instagram != null && updateMission.instagram != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.instagram })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

route.post('/updatetwitter', isAuth, (req, res) => {

    var updateMission = {

        twitter: req.body.twitter,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.twitter != null && updateMission.twitter != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.twitter })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})


route.post('/updateyoutube', isAuth, (req, res) => {

    var updateMission = {

        youtube: req.body.youtube,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.youtube != null && updateMission.youtube != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.youtube })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})


route.post('/updategithub', isAuth, (req, res) => {

    var updateMission = {

        github: req.body.github,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.id)
    }

    if (updateMission.github != null && updateMission.github != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results && results.code == 200) {

                res.send({ code: 200, result: updateMission.github })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})

module.exports = route



