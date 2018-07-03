const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    author: String,
    categories: [{ type: Schema.Types.ObjectId, ref:'Tags' }],
    publisher: String,
    cover: String,
    ISBN13: String,
    pageCount: Number
})

const Book = mongoose.model('Book', BookSchema)
module.exports = Book