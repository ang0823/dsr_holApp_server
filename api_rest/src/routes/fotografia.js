const express = require('express');
// Crea un objeto que permite definir URL's del servidor
const router = express.Router();

const mysqlConnection = require('../database');

// Sirve para agregar un nueva fotografía en la base de datos.
// Se deben enviar todos los nuevos datos de la fotografía en el archivo JSON.
// Datos: titulo, ruta_imagen
router.post('/fotografia', (req, res) => {
    console.log(req.body);

    if (mysqlConnection) {
        // Se busca el id del usuario que sube la fotografía
        mysqlConnection.query(`
        SELECT idcuenta
        FROM cuenta
        WHERE username = ?`, req.body.username, (err, result) => {
            if (!err) {
                // Se definen los datos que se van a insertar en la base de datos
                const picture = {
                    titulo: req.body.title,
                    ubicacion: req.body.ubicacion,
                    cuenta_idcuenta: result[0].idcuenta
                }

                // Se realiza la inserción a BD
                mysqlConnection.query(`INSERT INTO fotografia SET ?`, picture, (err) => {
                    if (!err) {
                        console.log("Nueva fotografía almacenada")
                        res.json({
                            succes: "true",
                            data: "Picture saved"
                        })
                    } else {
                        console.log(err)
                        res.json({
                            succes: "false",
                            data: res
                        })
                    }
                })
            } else {
                res.json({
                    succes: "false"
                })
            }
        })
    } else {
        console.log("No hay conexión con la base de datos.")
    }
})

// Sirve para eliminar una fotografía
// Se debe especificar el TITULO de la fotografía en el archivo JSON
router.delete('/fotografia', (req, res) => {
    // Se elimina la fotografía de la base de datos
    mysqlConnection.query('DELETE FROM fotografia WHERE titulo = ?', req.body.title, (err) => {
        if (!err) {
            console.log("Fotografía eliminada")
            res.json({
                succes: "true"
            })
        } else {
            console.log(err)
            res.json({
                succes: "false"
            })
        }
    })
})

// Sirve para marcar una fotografía como favorita en la cuenta del cliente dado
// Se debe enviar el titulo de la fotografía que se desea marca como favorita y 
// el nombre de usuario de quien la envia en el archivo JSON
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
                            console.log(result)
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