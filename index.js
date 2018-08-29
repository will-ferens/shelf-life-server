const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors')
require('dotenv').config()
//connect to MongoDB
const pw = encodeURIComponent(process.env.DB_PASSWORD)
const user = encodeURIComponent(process.env.BIG_WILLY_STYLE)

const uri = `mongodb://${user}:${pw}@ds233228.mlab.com:33228/shelf-life`
mongoose.connect(uri)

const db = mongoose.connection

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function () {
// we're connected!
})


app.get('/', (req, res) => {
    res.json('poop')
})

app.use(cors())

app.use(session({
    secret: `${process.env.DB_SECRET}`,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))
// parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// include routes
const routes = require('./routes/router')
const bookRoutes = require('./routes/books')

app.use('/', routes)
app.use('/books', bookRoutes)

app.use(session({
    secret: `${process.env.DB_SECRET}`,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))

// listen on port 3000
app.listen(3001, function () {
    console.log('Express app listening on port 3001')
})