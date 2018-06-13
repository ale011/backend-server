var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/user');

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error retrieving user",
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'User not found - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(401).json({
                ok: false,
                message: 'Bad credentials - password',
                errors: err
            });
        }

        // Create a token
        var token = jwt.sign({usuario: userDB}, SEED, { expiresIn: 14400 });

        userDB.password = '';

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });
    });
});


module.exports = app;