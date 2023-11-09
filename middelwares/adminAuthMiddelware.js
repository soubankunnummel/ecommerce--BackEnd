const jwt = require("jsonwebtoken")

module.exports = function verifyToken(req, res , next) {
    const token = req.headers["authorization"]
    // console.log(token);

    if(!token) {
        return res.status(403).json({erro:"NO token provided"})
    }
    jwt.verify(token, process.env.ADMIN_ACCES_TOKEN_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({error:"Unatherized"})
        }
        req.email = decoded.email
        
        next()
    })
}