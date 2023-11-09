const jwt = require('jsonwebtoken')

module.exports = function verifyToken (req,res, next) {
    const token = req.headers["authorization"]
    if(!token){
        return res.status(403).send({error:"No token Provided 🙆🏻‍♂️"})
    }
    jwt.verify(token, process.env.USER_ACCES_TOKEN_SECRET,(err, decode) => {
        if(err) {
            return res.status(401).json({error: "Unathorazed😠"})
        }
        req.username = decode.username
        next()
    })

}