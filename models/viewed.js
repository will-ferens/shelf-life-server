const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewedBookSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {type: String, required: true},
    author: {type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref:'User' },
    publisher: {type: String, required: false},
    cover: {type: String, required: false},
    ISBN13: {type: String, required: false},
    pageCount: {type: Number, required: false},
    readState: {type: String, default: 'ToRead'},
    description: {type: String, required: false}
})

const ViewedBook = mongoose.model('ViewedBook', ViewedBookSchema)

module.exports = ViewedBook