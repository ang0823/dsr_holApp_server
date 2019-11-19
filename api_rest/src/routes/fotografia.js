const express = require('express');
// Crea un objeto que permite definir URL's del servidor
const router = express.Router();
var verifyToken = require('../controllers/verifyToken')
const mysqlConnection = require('../database');

/**
 * Sirve para agregar una nueva fotografía en la base de datos.
 * @params req: título de la fotografía y nombre de usuario en formato JSON
 */
router.post('/upload', verifyToken, (req, res) => {
    const selectQuery = 'SELECT idcuenta FROM cuenta WHERE username = ?'
    const insertQuery = 'INSERT INTO fotografia SET ?'

    try {
        // Se busca el id del usuario que sube la fotografía
        mysqlConnection.query(selectQuery, req.body.username, (err, result) => {
            if (!err) {
                clientId = result[0].idcuenta
                // Se realiza la inserción a BD
                const data = {
                    'titulo': req.body.titulo,
                    'cuenta_idcuenta': clientId
                }
                mysqlConnection.query(insertQuery, data, (err) => {
                    if (!err) {
                        res.json({
                            succes: "true",
                            data: "Picture saved"
                        })
                        console.log("Nueva fotografía almacenada.")
                    } else {
                        res.json({
                            succes: "false",
                        })
                        console.log(err)
                    }
                })
            } else {
                res.json({
                    succes: "false",
                    info: "No username found"
                })
            }
        })
    } catch (error) {
        console.log("No hay conexión con BD.")
        throw error
    }
})

/**
 * Sirve para eliminar una fotografía
 * @params req: {"titulo":""}
 */
router.delete('/remove', verifyToken, (req, res) => {
    const selectQuery = 'SELECT id_fotografia FROM fotografia'
    const query = 'DELETE FROM fotografia WHERE ?'

    mysqlConnection.query(query, req.body, (err) => {
        if (!err) {
            console.log("Fotografía eliminada")
            res.json({
                succes: "true",
                message: "Picture removed"
            })
        } else {
            console.log(err)
            res.json({
                succes: "false"
            })
        }
    })
})

/**
 * Sirve para actualizar información de una fotografia
 * @params req: {"":""}
 */
router.put('/updatePhoto', verifyToken, (req, res) => {
    const query = 'UPDATE fotografia SET ?'

    try {
        mysqlConnection.query(query, req.body, (error) => {
            if (!error) {
                res.json({
                    auth: true,
                    message: "Data updated"
                })
            } else {
                res.json({
                    auth: true,
                    message: "Couldn't update data"
                })
            }
        })
    } catch (error) {

    }
})

/** Sirve para marcar una fotografía como favorita en la cuenta del cliente
+ @paramas req: {"titulo":"", "username":""}
*/
router.post('/favoritas', (req, res) => {
    var idclient;
    var idfoto;
    // Se busca el id dl cliente
    mysqlConnection.query('SELECT idcuenta FROM cuenta WHERE username = ?', req.body.username, (err, result) => {
        if (!err) {
            idclient = result[0].idcuenta

            // Se busca el id de la fotografía
            mysqlConnection.query('SELECT id_fotografia FROM fotografia WHERE titulo = ?', req.body.titulo, (err, result) => {
                if (!err) {
                    idfoto = result[0].id_fotografia

                    // Se definen los datos a insertar en BD
                    const info = {
                        fotografia_id: idfoto,
                        cuenta_id: idclient
                    }

                    // Se realiza la inserción en BD
                    mysqlConnection.query(`INSERT INTO favoritas SET ?`, info, (err) => {
                        console.log(info)
                        if (!err) {
                            res.json({
                                succes: "true"
                            })
                        } else {
                            console.log(err)
                            res.json({
                                succes: false
                            })
                        }
                    })

                } else {
                    console.log(err)
                }
            })
        } else {
            console.log(err)
        }
    })
})

module.exports = router;