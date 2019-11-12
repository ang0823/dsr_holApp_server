const express = require('express');
// Crea un objeto que permite definir URL's del servidor
const router = express.Router();

const mysqlConnection = require('../database');

// Sirve para registrar un nuevo cliente
// Se debe enviar todos los datos para la nueva cuenta en el archivo JSON
// Datos: nombre, apellido_p, apellido_m, usernanme, password y state
router.post('/cuenta', (req, res) => {
    var client = {
        nombre: req.body.nombre,
        apellido_p: req.body.apellido_p,
        apellido_m: req.body.apellido_m,
        username: req.body.username,
        password: req.body.password,
        state: "1"
    }

    if (mysqlConnection) {
        mysqlConnection.query('INSERT INTO cuenta SET ?', client, (err, result) => {
            if (!err) {
                res.json({ 
                    Status: 'Datos guardados',
                    data: result.body
                });
            } else {
                res.json({ Status: 'false' });
                console.log(err);
            }
        })
    }
});

// Sirve para actualizar la conntraseña del cliente
// Se debe enviar el USERNAME y la nueva contraseña en el archivo JSON
router.put('/update/password', (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }

    mysqlConnection.query(`
    UPDATE cuenta 
    SET password = ?
    WHERE username = ?`, [userData.password, userData.username], (err, rows) => {
        if (!err) {
            res.json({ 
                success: 'true' 
            });
        } else {
            console.log(err);
            res.json(
                {
                    sent: userData,
                    success: 'false'
                }
            );
        }
    })
})

// Sirve para actualizar el nombre del cliente
// Se debe enviar el USERNAME y el nuevo nombre en el archivo JSON
router.put('/update/name', (req, res) => {
    const newName = {
        username: req.body.username,
        name: req.body.name
    }

    console.log(newName);
    
    mysqlConnection.query(`
    UPDATE cuenta
    SET nombre = ?
    WHERE username = ?`, [newName.name, newName.username], (err, rows) => {
        console.log(err);
        if(!err) {
            res.json({
                success: "true",
                data: req.body
            })
        } else {
            res.json({
                success: "false"
            })
        }
    })
})

// Sirve para actualizar el apellido paterno del cliente
// Se debe enviar el USERNAME y el nuevo apellido en el archivo JSON
router.put('/update/apellidop', (req, res) => {
    const newLastname = {
        username: req.body.username,
        apellido_p: req.body.apellido_p
    }

    console.log(newName);
    
    mysqlConnection.query(`
    UPDATE cuenta
    SET apellido_p = ?
    WHERE username = ?`, [newLastname.apellido_p, newLastname.username], (err, rows) => {
        console.log(err);
        if(!err) {
            res.json({
                success: "true",
                data: req.body
            })
        } else {
            res.json({
                success: "false"
            })
        }
    })
})

// Sirve para actualizar el apellido materno del cliente
// Se debe enviar el USERNAME y el nuevo apellido en el archivo JSON
router.put('/update/apellidom', (req, res) => {
    const newLastname = {
        username: req.body.username,
        apellido_m: req.body.apellido_m
    }

    console.log(newLastname);
    
    mysqlConnection.query(`
    UPDATE cuenta
    SET apellido_m = ?
    WHERE username = ?`, [newLastname.apellido_m, newLastname.username], (err, rows) => {
        console.log(err);
        if(!err) {
            res.json({
                success: "true",
                data: req.body
            })
        } else {
            res.json({
                success: "false"
            })
        }
    })
})

// Sirve para actualizar ambos apellidos del cliente
// Se debe enviar el USERNAME y los nuevos apellidos en el archivo JSON
router.put('/update/apellidos', (req, res) => {
    const newLastname = {
        username: req.body.username,
        apellido_p: req.body.apellido_p,
        apellido_m: req.body.apellido_m
    }

    console.log(newLastname);
    
    mysqlConnection.query(`
    UPDATE cuenta
    SET apellido_p = ?, apellido_m = ?
    WHERE username = ?`, [newLastname.apellido_p, newLastname.apellido_m, newLastname.username], (err, rows) => {
        console.log(err);
        if(!err) {
            res.json({
                success: "true",
                data: req.body
            })
        } else {
            res.json({
                success: "false"
            })
        }
    })
})

// Sirve para actualizar el nombre completo del cliente
// Se debe enviar el USERNAME y el nuevo nombre y apellidos en el archivo JSON
router.put('/update', (req, res) => {
    const newName = {
        username: req.body.username,
        nombre: req.body.nombre,
        apellido_p: req.body.apellido_p,
        apellido_m: req.body.apellido_m
    }

    console.log(newName);
    
    mysqlConnection.query(`
    UPDATE cuenta
    SET nombre = ?, apellido_p = ?, apellido_m = ?
    WHERE username = ?`, [newName.nombre, newName.apellido_p, 
        newName.apellido_m, newName.username], (err, rows) => {
        console.log(err);
        if(!err) {
            res.json({
                success: "true",
                data: req.body
            })
        } else {
            res.json({
                success: "false"
            })
        }
    })
})

// Sirve para cambiar el estado del cliente. Conectado: 1, Desconectado: 0
// Se debe enviar el USERNAME y el estado en el archivo JSON
router.put('/status', (req, res) => {
    const state = {
        username: req.body.username,
        state: req.body.state
    }

    mysqlConnection.query(`
    UPDATE cuenta
    SET state = ?
    WHERE username = ?`, [state.state, state.username], (err, rows) => {
        if(!err) {
            res.json({
                success: "true",
                data: "State updated"
            })
        } else {
            res.json({
                success: "false"
            })
        }
    })
})

module.exports = router;