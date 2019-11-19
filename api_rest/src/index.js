const express = require('express');
//Regresa un objeto que se alcena en la variable app
// lo cual crea el servidor sin iniciarñp
const app = express();

// SETTINGS

// Para escuchar en un puerto dado por el servidor:
app.set('port', 3035);

// MIDDLEWARE: funciones que se ejecutan antes de procesar algo

// Aquí se convierten los datos de entrada en formato JSON
app.use(express.json());

// ROUTES: URL's usadas para manipular datos

app.use(require('./routes/cuentas'));
app.use(require('./routes/fotografia'));

// Se inicializa el servidor en el puerto 3000
// y se imprime un mensaje en consola despues de iniciar
app.listen(app.get('port'), () => {
    console.log('Running server on port', app.get('port'));
})