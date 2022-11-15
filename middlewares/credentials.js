const allowedOrigins = require('../config/allowedOrigins')

const credentials = (req,res,next) => {   //how are we passing more than one parameter in an arrow function, is it possible?
    const origin = req.headers.origin
    if(allowedOrigins.includes(origin)){
        res.header('Access-Control-Allow-Credentials', true)
    }
    next()
}
module.exports = credentials