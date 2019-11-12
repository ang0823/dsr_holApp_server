const mysql = require('mysql');

// Modulo para conectarse a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dsr_holapp',
    password: 'dsr_holapp',
    database: 'dsr_holapp'
})

connection.connect(function(err) {
    if(err) {
        console.log('No se pudo conectar a la base de datos. Credenciales incorrectas.');
        return;
    } else {
        console.log('Base de datos conectada');
    }
});

module.exports = connection;