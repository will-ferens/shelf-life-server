const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Book = require('../models/book')

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
    
    User.search(req.body.email, req.body.password, function(error, user){
        
        if(error || !user) {
            let err = new Error('Wrong email or password.')
            err.status = 401
            return next(err)
        } else {
            req.session.userId = user._id
            console.log(req.session.userId)
            return res.json({message: 'Success', userId: req.session.userId})
        }
    })
})

router.post('/addbook', function(req, res, next){
    const bookToBeAdded = new Book()
    
    bookToBeAdded.title = req.body.title
    bookToBeAdded.author = req.body.author
    bookToBeAdded.publisher = req.body.publisher
    bookToBeAdded.cover = req.body.cover
    bookToBeAdded.pageCount = req.body.pageCount

    console.log(bookToBeAdded)
    res.json({message: 'success'})
})



module.exports = router