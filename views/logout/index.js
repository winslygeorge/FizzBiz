const express = require('express')

const route = express.Router()

const isAuth = (req, res, next)=>{

    if(req.session.isAuth){

        next()
    }else{

        res.redirect('/login')
    }
}

route.get('/logout', isAuth, (req, res)=>{

    req.session.destroy((err)=>{

        if(!err){

            console.log('user successfully logged out')
            res.redirect('/home')
        }else{

            res.redirect('/apps/all')
        }
    })

})

module.exports = route