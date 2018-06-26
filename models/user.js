const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
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
    }
})


const User = mongoose.model('User', UserSchema)

UserSchema.method.search = function (email, password, callback){
    
    User.findOne({ email: email })
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


User.find(function (err, users) {
    if(err) return console.error(err)
    console.log(users)
})

module.exports = User