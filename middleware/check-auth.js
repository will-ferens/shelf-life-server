const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, "poopypoopybuttholes6969")
        req.userData = decoded
        next()
    } catch(error) {
        return res.status(401).json({
            message: 'Authorization failed'
        })
    }
}