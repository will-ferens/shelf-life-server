const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Book  = require('./book')
const ViewedBook = require('./viewed')

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    },
    booksOnShelf: [{ type: Schema.Types.ObjectId, ref:'Book' }],
    viewedBooks: [{ type: Schema.Types.ObjectId, ref: 'ViewedBook' }],
    likedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
})




UserSchema.statics.search = function (email, password, callback){
    
    this.findOne({ email: email })
        .exec(function (err, user){
            if(err){
                return callback(err)
            } else if (!user) {
                let err = new Error('User not found.')
                return callback(err)
            }
            bcrypt.compare(password, user.password, function(err, result){
                if(result === true){
                    return callback(null, user)
                } else {
                    return callback()
                }
            })
        })
        
}



UserSchema.pre('save', function(next){
    const user = this
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return next(err)
        }
        user.password = hash
        next()
    })
} )



const User = mongoose.model('User', UserSchema)
module.exports = User