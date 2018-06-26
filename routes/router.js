const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post('/register', function (req, res, next) {
    // confirm that user typed same password twice
    if(req.body.password === req.body.passwordConf){
        const userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        const user = new User()
        user.email = userData.email
        user.username = userData.username
        user.password = userData.password
        user.passwordConf = userData.passwordConf

        console.log(user)

        user.save(function(err){
            if(err) {
                res.json({
                    status: 500,
                    error: err
                })
                res.end()
            } else {
                res.json({
                    status: 200,
                    user: user
                })
                res.end()
            }
        })
    } 
})

router.post('/auth', function (req, res, next){
    
    User.search(req.body.logemail, req.body.logpassword, function(error, user){
        
        if(error || !user) {
            let err = new Error('Wrong email or password.')
            err.status = 401
            return next(err)
        } else {
            req.session.userId = user._id
            return res.send('fuuuuck yeah')
        }
    })
})

module.exports = router