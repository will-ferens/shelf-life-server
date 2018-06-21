const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

//connect to MongoDB
mongoose.connect('mongodb://localhost/shelflife')
const db = mongoose.connection

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function () {
// we're connected!
})


app.get('/', (req, res) => {
    res.json('poop')
})
//use sessions for tracking logins
app.use(session({
    secret: 'poop',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))

// parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// serve static files from template
//app.use(express.static(__dirname + '/templateLogReg'))

// include routes
var routes = require('./routes/router')
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found')
    err.status = 404
    next(err)
})

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
})


// listen on port 3000
app.listen(3001, function () {
    console.log('Express app listening on port 3001')
})