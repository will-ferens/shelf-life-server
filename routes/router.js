const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Book = require('../models/book')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

router.post('/register',  (req, res, next) => {
    // confirm that user typed same password twice
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(422).json({
                    message: 'A user with this email already exists.'
                })
            } else {
                if(req.body.password === req.body.passwordConf){
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        passwordConf: req.body.passwordConf,
                    })
                    user
                        .save()
                        .then(result => {
                            res.status(201).json({
                                message: 'User created'
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                } 
            }
        })
    
})

router.post('/auth', function (req, res, next){
    
    User.search(req.body.email, req.body.password, (error, user) => {
        
        if(error || !user) {
            let err = new Error('Wrong email or password.')
            err.status = 401
            return next(err)
        } else {
            const token = jwt.sign({
                email: user.email,
                userId: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: "1hr"
            })
            return res.json({
                message: 'Success',
                userId: user._id,
                token: token
            })
        }
    })
})

router.post('/addbook', (req, res, next) => {
    const bookToBeAdded = new Book({
        _id: new mongoose.Types.ObjectId(),
        title :req.body.title,
        author :req.body.author,
        publisher :req.body.publisher,
        cover :req.body.cover,
        pageCount :req.body.pageCount,
        user: req.body.userId
    })
    const userId = req.body.userId
    bookToBeAdded.save()
        .then(book => {
            Book.find({}).populate(userId)
                .exec()
                .then(result => {
                    
                    res.status(200).json({message: 'success'})
                })
                .catch(err => {
                    res.status(500).json({message: err})
                })
        })
})

router.delete('/books', (req, res, next) => {
    Book.find({}).remove()
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'books deleted'
            })
        })
        .catch(err => {
            res.status(500).json({message: err})
        })
})
    




module.exports = router