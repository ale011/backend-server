// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initializa variables
var app = express();

// Database connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Database is  \x1b[32m%s\x1b[0m', 'online');
});

//Routes
app.get('/', (req, res, next) => {
    res.status(301).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});

// Listen express requests
app.listen(3000, () => {
    console.log('Express server running at port 3000 \x1b[32m%s\x1b[0m', 'online');
});