const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

const User = require('../models/user')
const Book = require('../models/book')
const ViewedBook = require('../models/viewed')

router.get('/', checkAuth, (req, res) => {
    const userId = req.userData.userId

    Book.find({user: userId})
        .exec()
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.status(500).json({message: err})
        })
})

router.post('/view', checkAuth, (req, res) => {

    const viewedBook = new Book({
        _id: new mongoose.Types.ObjectId(),
        title :req.body.title,
        author :req.body.author,
        publisher :req.body.publisher,
        cover :req.body.cover,
        pageCount :req.body.pageCount,
        description: req.body.description, 
        user: req.userData.userId
    })
    const userId = req.body.userId
    console.log(viewedBook)
    viewedBook.save()
        .then(book => {
            ViewedBook.find({user: userId})
                .exec()
                .then(result => {
                    res.status(201).json({
                        message: "book viewed",
                        book: {
                            _id: result.id,
                            title: result.title,
                            author: result.author
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({message: err})
                })
        })

})
router.post('/addbook', checkAuth, (req, res) => {
    
    const bookToBeAdded = new Book({
        _id: new mongoose.Types.ObjectId(),
        title :req.body.title,
        author :req.body.author,
        publisher :req.body.publisher,
        cover :req.body.cover,
        pageCount :req.body.pageCount,
        description: req.body.description, 
        user: req.userData.userId
    })
    const userId = req.body.userId
    console.log(bookToBeAdded)
    
    bookToBeAdded.save()
        .then(book => {
            Book.find({user: userId})
                .exec()
                .then(result => {
                    res.status(201).json({
                        message: "book created",
                        book: {
                            _id: result._id,
                            title: result.title,
                            author: result.author
                        }
                    })
                })
                .catch(err => {
                    res.status(500).json({message: err})
                })
        })
})



router.put('/:bookId', checkAuth, (req, res) => {
    const id = req.params.bookId
    const readState = req.body.readState
    const userId = req.userData.userId

    Book.update({_id: id}, { readState: readState })
        .exec()
        .then(result => {
            Book.find({user: userId})
                .exec()
                .then(result => {
                    res.status(200).json(result)
                })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.delete('/:bookId', checkAuth, (req, res) => {
    const id = req.params.bookId
    Book.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'book deleted',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({message: err})
        })
})

module.exports = router