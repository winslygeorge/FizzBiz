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

route.post('/updateiconimage', isAuth, (req, res) => {
    
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {

        var profileImg = null, profileImgErr = null

        var appname = fields.appname, appid = parseInt(fields.appid), cat = parseInt(fields.cat)
        if (!err) {
            
            if (handleImageUpload(files)) {



                profileImg = files.profileImage.name

            } else {

                profileImgErr = "invalid image type \n Expected .png, .jpg, .jpeg"
            }


            if (profileImg != null && profileImg != undefined) {

                var profileIg = appname + '_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + '.' + profileImg.split('.')[1]


               

                var updateIcon = {

                    operation: 'update',
                    tablename: 'businessapp',
                    brandicon : profileIg,
                    where: 'id',
                    val : appid
                }
                dbcon.run(updateIcon).then(function (results) {
                    
                    if (results.code == 200) {


                        var oldPath = files.profileImage.path

                        var newPath = path.join(__dirname, './../images') + '/' + profileIg
                        console.log(newPath)
                        var rawData = fs.readFileSync(oldPath)

                        fs.writeFileSync(newPath, rawData, function (err) {

                            if (err) {

                                console.log(err)
                            } else {

                                console.log('image uploaded successfully')
                            }
                        })


                        console.log("operation was successfull")
                        

                        res.redirect(`/app/${appname}?id=${appid}&cat=${cat}`)


                        
                    } else {

                        console.log(results.result)
                        
                        res.redirect(`/app/${appname}?id=${appid}&cat=${cat}`)


                    }
                })

            } else {

                console.log("null empty fields..")
                
                res.redirect(`/app/${appname}?id=${appid}&cat=${cat}`)
            }

        } else {
            
            res.send({code : 101, error: 'error changing icon image'})
        }
    })
})


route.post('/updatemission', isAuth, (req, res) => {
    
    var updateMission = {

        mission: req.body.mission,
        
        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.appid)
    }

    if (updateMission.mission != null && updateMission.mission != undefined) {
        
        dbcon.run(updateMission).then(function (results) {
            
            if (results.code == 200) {
                
                res.send({code : 200})

            } else {
                
res.send({code : 101})
            }
        })
    }
})


route.post('/updateEmail', isAuth, (req, res) => {

    var updateMission = {

        businessemail: req.body.email,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.appid)
    }

    if (updateMission.businessemail != null && updateMission.businessemail != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results.code == 200) {

                res.send({ code: 200 })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})


route.post('/updateIntro', isAuth, (req, res) => {

    var updateMission = {

        shortintro: req.body.intro,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.appid)
    }

    if (updateMission.shortintro != null && updateMission.shortintro != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results.code == 200) {

                res.send({ code: 200 })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})


route.post('/updaterange', isAuth, (req, res) => {

    var updateMission = {

        range: req.body.range,

        operation: 'update',
        tablename: 'businessapp',
        where: 'id',
        val: parseInt(req.body.appid)
    }

    if (updateMission.range != null && updateMission.range != undefined) {

        dbcon.run(updateMission).then(function (results) {

            if (results.code == 200) {

                res.send({ code: 200 })

            } else {

                res.send({ code: 101 })
            }
        })
    }
})


route.post('/updateaddservice', (req, res) => {
    
    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {


        if (!err) {

            var serviceIcon, serviceIconErr = null

            if (handleserviceIconUpload(files)) {



                serviceIcon = files.serviceIcon.name

            } else {

                serviceIconErr = "invalid image type \n Expected .png, .jpg, .jpeg"
            }


            if(serviceIcon != null){

            

            let newservice = {
                

                id: new Date()  * 100,

                servicename: clean.CleanData(fields.serviceName),
                serviceicon: serviceIcon,

                servicedesc: clean.CleanData(fields.serviceDesc),
                price: parseFloat(fields.servicePrice),

                businessid: fields.appid,
                created_at: new Date(),
                type : clean.CleanData(fields.type),
                tablename: "services",

                operation: "insert"
            }

            

            var profileIg = newservice.servicename + '_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + '.' + newservice.serviceicon.split('.')[1]

            newservice.serviceicon = profileIg;

            console.log(newservice)


            if (newservice.id != null && newservice.servicedesc != null && newservice.servicename != null && newservice.price != null && newservice.serviceicon != null) {


                dbcon.run(newservice).then(function (results) {

                    if (results.code == 200) {

                        res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)
                       
                           
                     
                        var oldPath = files.serviceIcon.path

                        var newPath = path.join(__dirname, './../images') + '/' + profileIg
                        console.log(newPath)
                        var rawData = fs.readFileSync(oldPath)

                        fs.writeFileSync(newPath, rawData, function (err) {

                            if (err) {

                                console.log(err)
                            } else {

                                console.log('image uploaded successfully')
                            }
                        })


                        var selectFollowers = {
                            operation: "select",
                            tablename: "followers",

                            fields: [],

                            wfield: ["businessappid"],

                            wvalue: [newservice.businessid],
                        };

                        dbcon.run(selectFollowers).then(function (results) {
                            if (results.code == 200) {
                                var followers = results.result.rows;

                                console.log(followers.length);

                                if (followers.length == 0) {
                                    res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)

                                }
                                followers.forEach((follower) => {
                                    var getEmail = follower.USEREMAIL;

                                    var getUsername = follower.USERNAME;

                                    console.log(getEmail);

                                    var email = {
                                        from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                                        to: getEmail,
                                        subject: "New Service Added",
                                        template: "newservice",
                                        context: {

                                            username : getUsername,

                                            appname: fields.appname,
                                        
                                            servicename: newservice.servicename,

                                            servicedesc: newservice.servicedesc,

                                            title: "New Service page",
                                        },

                                        attachments: [
                                            {
                                                filename: "FizzBizNet.png",
                                                path: path.join(
                                                    __dirname,
                                                    "./../../email/views/images/FizzBizNet.png"
                                                ),
                                                cid: "logoimg", //same cid value as in the html img src
                                            }
                                
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

                                })
                            }
                        })

                        
                    } else {

                        console.log(results.result)

                        res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)

                    }
                
                })

            }
        
            } else {

                res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)

            }

        }

    })
})

route.post('/updateaddlocation', isAuth, (req, res) => {
    
    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {


        if (!err) {

            var hqContinent, hqCountry, hqTown, hqAddress, hqContinentErr = null

            if (fields.continent.match(/^[a-zA-Z0-9\s]+$/) && fields.country.match(/^[a-zA-Z0-9\s]+$/) && fields.towncity.match(/^[a-zA-Z0-9\s]+$/)) {

                hqContinent = clean.CleanData(fields.continent)
                hqCountry = clean.CleanData(fields.country)
                hqTown = clean.CleanData(fields.towncity)
                hqAddress = clean.CleanData(fields.address)
            } else {

                hqContinentErr = "Expected letters space and numbers only on location"
            }

            if (hqAddress != null && hqContinent != null && hqCountry != null && hqTown != null) {


                var location = {

                    id: new Date() * Math.round(Math.random() * 10),
                    businessappid: parseInt(fields.appid),
                    continent: hqContinent,
                    country: hqCountry,
                    towncity: hqTown,
                    address: hqAddress,
                    tablename: "locations",

                    operation: "insert"
                }

                dbcon.run(location).then(function (results) {

                    if (results.code == 200) {

                        res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)

                    } else {

                        console.log(results.result)

                        res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


                    }
                }, function (err) { })

            } else {

                res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


            }

        } else {

            res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


        }
    })
})



route.post('/updateaddimage', isAuth, (req, res) => {

    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {


        if (!err) {

            var ImageIcon, ImageIconErr = null

            if (handleserviceImagesUpload(files)) {



                ImageIcon = files.img.name

            } else {

                ImageIconErr = "invalid image type \n Expected .png, .jpg, .jpeg"
            }


            if (ImageIcon != null) {

                var profileIg = fields.appname + '_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + '.' + ImageIcon.split('.')[1]


                var newImage = {

                    id: new Date() * Math.round(Math.random() * 20),

                    businessappid: fields.appid,

                    imagelink: profileIg,

                    tablename: "businessimages",

                    operation: "insert"
                }

                dbcon.run(newImage).then(function (results) {

                    if (results.code == 200) {

                        var oldPath = files.img.path

                        var newPath = path.join(__dirname, './../images') + '/' + profileIg
                        console.log(newPath)
                        var rawData = fs.readFileSync(oldPath)

                        fs.writeFileSync(newPath, rawData, function (err) {

                            if (err) {

                                console.log(err)
                            } else {

                                console.log('image uploaded successfully')
                            }
                        })


                        res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


                    } else {

                        console.log(results.result)
                        res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)



                    }
                })
            }

        } else {

            res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


        }
    })
})


route.post('/updateaddvideo', isAuth, (req, res) => {




        let form = new formidable.IncomingForm()

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

                    id = youtubeid.slice(
                        youtubeid.indexOf("=") + 1
                    );


                }

                var newVideo = {

                    id: new Date() * Math.round(Math.random() * 94),


                    businessvideolink: id,

                    businessappid: fields.appid,



                    tablename: "businessvideos",

                    operation: "insert"
                }

                if (newVideo.businessvideolink != null && newVideo.businessappid != null && newVideo.id != null) {


                    dbcon.run(newVideo).then(function (results) {

                        if (results.code == 200) {


                            res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


                        } else {

                            console.log(results.result)

                            res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)



                        }
                    })

                } else {

                    res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


                }

            } else {

                res.redirect(`/app/${fields.appname}?id=${fields.appid}&cat=${fields.cat}`)


            }
        })

    })

route.post('/emailpasswordchangerequest', (req, res) => {
    
    var recEmail = clean.CleanData(req.body.email)

    var selectEmail = {

        operation: 'select',

        tablename: 'users',

        fields : [],
        
        wfield: ['email'],
        wvalue : [recEmail]
        
    }

    dbcon.run(selectEmail).then(function (results) {
        
        if (results.code == 200) {

            var user = results.result.rows[0]


            var email = {
                from: `Fizzbiznet  <fizzbiznet@gmail.com>`,
                to: recEmail,
                subject: "Change Password",
                template: "passwordchange",
                context: {

                    username: user.USERNAME,

                    useremail : recEmail,

                    title: "Password change",
                },

                attachments: [
                    {
                        filename: "FizzBizNet.png",
                        path: path.join(
                            __dirname,
                            "./../../email/views/images/FizzBizNet.png"
                        ),
                        cid: "logoimg", //same cid value as in the html img src
                    }

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

                        res.send({code : 200})
                    },
                    function (error) {
                        console.log(error);

                        res.send({code : 101})
                    }
                );
            
    


        } else {
            
            res.send({code : 400})
        }
    })
})


//add user images to gallery.........................................................................................................



route.post('/adduserimage', isAuth, (req, res) => {

    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {


        if (!err) {

            var ImageIcon, ImageIconErr = null

            if (handleserviceImagesUpload(files)) {



                ImageIcon = files.img.name

            } else {

                ImageIconErr = "invalid image type \n Expected .png, .jpg, .jpeg"
            }


            if (ImageIcon != null) {

                var profileIg = req.session.userDetails.username + '_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + '.' + ImageIcon.split('.')[1]


                var newImage = {

                    id: new Date() * Math.round(Math.random() * 20),

                    username: req.session.userDetails.username,

                    imageurl: profileIg,

                    imagedetails : clean.CleanData(fields.comment),

                    imagetag : fields.tag,

                    userimage: req.session.userDetails.profileimage,
                    created_at : new Date(),

                    tablename: "userimages",

                    operation: "insert"
                }

                dbcon.run(newImage).then(function (results) {

                    if (results.code == 200) {

                        var oldPath = files.img.path

                        var newPath = path.join(__dirname, './../images') + '/' + profileIg
                        console.log(newPath)
                        var rawData = fs.readFileSync(oldPath)

                        fs.writeFileSync(newPath, rawData, function (err) {

                            if (err) {

                                console.log(err)
                            } else {

                                console.log('image uploaded successfully')
                            }
                        })


                        res.redirect('/user/gallery/' + req.session.userDetails.username)

                    } else {

                        console.log(results.result)
                        res.redirect('/user/gallery/' + req.session.userDetails.username)


                    }
                })
            }

        } else {

            res.redirect('/user/gallery/' + req.session.userDetails.username)

        }
    })
})

//......................................~!>

    


    module.exports = route


    function handleImageUpload(files) {
        if (!files.profileImage) {

            return false;
        } else {


            let ext = files.profileImage.name.split('.')[1].toLowerCase();

            if (ext.match('png') || ext.match('jpg') || ext.match('jpeg')) {

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


            let ext = files.serviceIcon.name.split('.')[1].toLowerCase();

            if (ext.match('png') || ext.match('jpg') || ext.match('jpeg')) {

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


            let ext = files.img.name.split('.')[1].toLowerCase();

            if (ext.match('png') || ext.match('jpg') || ext.match('jpeg')) {

                return true;

            } else {

                return false;
            }

        }
    }

