// importaciones ej import express from 'expres';
const express = require('express');
const config = require('./config');
var cors = require('cors');
// llamar rutas ROUTES (la importanmos)
const users = require('./routes/routes');
const morgan = require('morgan');
const app = express();
app.use(cors());

// configuraciones settings
app.set('port', config.app.port);

//middleware falta
app.use(morgan('dev'));
app.use(express.json());

// rutas url de la api    localhost:4000/api/users
app.use('/api', users);

// exportacion ej export default app;
module.exports = app;

