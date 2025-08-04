const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer token
    if (!token) {
        return res.status(401).json({
            error: 'Access denied: token missing'
        })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    } catch (err) {
        res.status(403).json({
            error: 'Invalid token'
        })
    }
}