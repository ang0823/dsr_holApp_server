const jwt = require('jsonwebtoken')
const config = require('../config')

function verifyToken(req, res, next) {
    console.log('Verify token function' + req.headers['x-access-token'])
    var token = req.headers['x-access-token']
    if(token == "") {
        // Se genera un token para este usuario
        token = jwt.sign({ username: req.body.username }, config.secret)
    }

    console.log('Verificando ' + token)
    try {
        const decoded = jwt.verify(token, config.secret)
        console.log('Token válido')
        req.username = decoded.username
        next()
    } catch (error) {
        console.log('Token inválido')
        return res.json({
            auth: false,
            message: "Invalid token"
        })
    }
}

module.exports = verifyToken