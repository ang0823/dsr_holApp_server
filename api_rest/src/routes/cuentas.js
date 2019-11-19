const express = require('express');
// Crea un objeto que permite definir URL's del servidor
const router = express.Router();
const mysqlConnection = require('../database');
//Archivo en donde se encuentra la palabra secreta par manejar tokens
const config = require('../config')
const jwt = require('jsonwebtoken')
// Archivo con funcion de vificacion de tokens
const verifyToken = require('../controllers/verifyToken')
// Tiempo en segundos en que es validos el token
const seconds = 86400

router.post('/signin', verifyToken, (req, res) => {
    const query = 'SELECT password FROM cuenta WHERE username = ?'
    const sentPassword = req.body.password
    try {
        mysqlConnection.query(query, req.username, (error, result) => {
            console.log(result[0].password + " == " + req.body.password)
            const realPassword = result[0].password
            if (realPassword == sentPassword) {
                res.json({
                    auth: true,
                    message: "Welcome back"
                })
            } else {
                res.json({
                    auth: false,
                    message: "Username or password incorrect"
                })
            }
        })
    } catch (error) {
        res.json({
            auth: false,
            message: error.message
        })
    }
})

/**
 * Regresa toda la información de la cuenta con sesión iniciada
 * @params req: {"username": ""}
 */
router.get('/', verifyToken, (req, res) => {
    const query = "SELECT nombre, apellido_p, apellido_m, username FROM cuenta WHERE username = ?"
    try {
        mysqlConnection.query(query, req.username, (err, result) => {
            if (result) {
                return res.status(200).json({
                    result
                })
            } else {
                console.log(req.headers['Ya se ejecutó middleware'])
                return res.status(404).json({
                    auth: false,
                    message: "User not found"
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            error: '500',
            message: 'Could not retrieve data'
        })
    }
})


/** 
 * Sirve para registrar un nuevo cliente
 * @args req = {"nombre":"", "apellido_p":"", "apellido_m":"", "username":"", "password":""}
 */
router.post('/signup', (req, res) => {
    var query = 'INSERT INTO cuenta SET ?'
    try {
        mysqlConnection.query(query, req.body, (err) => {
            if (!err) {
                // Se genera un token para este usuario
                // con vigencia de 24 hrs
                const token = jwt.sign({ username: req.body.username }, config.secret)
                res.json({
                    saved: "true",
                    token
                });
                console.log('Se registró un nuevo cliente: ' + token)
            } else {
                res.json({
                    saved: 'false',
                    token: 'null'
                });
                console.log(err.message);
            }
        })
    } catch (error) {
        res.json({
            saved: false,
            message: "Could not save new client."
        })
    }
});

/**
 * Actualiza la informacion del cliente segun los parametros
 * Se deben enviar SOLO los datos a actualizar en archivo JSON
 * @args req: campos a actualizar en formato JSON 
 * @params Nombre de usuario
 */
router.put('/update', verifyToken, (req, res) => {
    console.log("entering endpoind...")
    const query = 'UPDATE cuenta SET ? WHERE username = ?'
    try {
        mysqlConnection.query(query, [req.body, req.username], (err, result) => {
            if (result) {
                res.status(200).json({
                    auth: "true",
                    imessage: "Client updated"
                })
                console.log('Se actualizó información de ' + req.username)
            } else {
                res.json({
                    auth: "false",
                    message: "Access denied"
                })
                console.log(err.message)
            }
        })
    } catch (error) {
        res.status(500).json({
            auth: false,
            message: "Update denied"
        })
    }
})

/**
 * Elmina de la base de datos el usuario indicado.
 * Se debe enviar el nombre de usuario en los parametros
 * @args req.header: {"x-access-token":""}
 */
router.delete('/delete', verifyToken, (req, res) => {
    var query = 'DELETE FROM cuenta WHERE username = ?'
    try {
        mysqlConnection.query(query, req.username, (err, result) => {
            if (result.affectedRows > 0) {
                res.json({
                    auth: "true",
                    message: "Client deleted"
                })
                console.log("Se eliminó un cliente")
            } else {
                res.json({
                    auth: true,
                    message: "Unknown user"
                })
                console.log("Intento fallido: DELETE")
            }
        })
    } catch (error) {
        res.json({
            auth: false,
            message: err.message
        })
    }
})

/**
 * Regresa la información del amigo o amigos que se encontraron
 * según la información que se envie
 * @params req: {"":""}
 */
router.get('/findfriend', (req, res) => {
    const query = 'SELECT nombre, apellido_p, apellido_m FROM cuenta WHERE ?'

    try {
        mysqlConnection.query(query, req.body, (error, result) => {
            console.log('Se buscó amigo ')
            if(result.length > 0) {
                res.json({
                    succes: true,
                    result
                })
            } else {
                res.json({
                    succes: false,
                    message: "No matches found"
                })
            }
        })
    } catch (error) {
        res.json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router