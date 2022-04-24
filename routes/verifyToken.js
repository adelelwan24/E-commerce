const jwt = require('jsonwebtoken')

const verifyToken = (request, responce, next) => {
    const authHeader = request.cookies.jwt
    if (authHeader) {
        const token = authHeader
        jwt.verify(token,process.env.jwt_sec, (err,decodedToken) => {
            if (err) return responce.status(403).json('Token is not valid!')
            request.user = decodedToken
            next()
        })
    }else {
        return responce.status(401).json('you are not authenticated!')
    }
}


const verifyTokenAndAuthorization = (requset,responce,next) => {
    verifyToken(requset,responce, () => {
        if (requset.user._id === requset.params.id || requset.user.isAdmin) {
            next()
        }else {
            return responce.status(403).json('You are not allowed')
        }
    })
}

const verifyTokenAndAdmin = (requset,responce,next) => {
    verifyToken(requset,responce, () => {
        if (requset.user.isAdmin) {
            next()
        }else {
            return responce.status(403).json('You are not allowed')
        }
    })
}
module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}