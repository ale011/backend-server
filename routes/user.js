var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAuth = require('../middlewares/authentication');

var app = express();

var Usuario = require('../models/user');

//Routes
app.get('/', (req, res, next) => {

    Usuario.find({}, 'id name email img role')
    .exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'databse error users',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });
});

//============================================
// Update new user
//============================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error searching user',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                 message: 'User with id ' + id +' not found'
            });
        }

        usuario.name = body.name;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, savedUser) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    name: body.name,
                    message: "Error updating user",
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: savedUser
            });
        });

    });
});

//============================================
// Create new user
//============================================

app.post('/', mdAuth.verifyToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, savedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: savedUser,
            logedInUser: req.logedInUser
        });
    });

});

//============================================
// Delete a user
//============================================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {
    
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user ' + id + '',
                error: err
            }); 
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                message: 'User does not exist'
            });
        }

        res.status(200).json({
            ok: true,
            usuario: deletedUser
        });
    });
});

module.exports = app;