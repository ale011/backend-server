var express = require('express');

var app = express();

//Routes
app.get('/', (req, res, next) => {
    res.status(301).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});

module.exports = app;