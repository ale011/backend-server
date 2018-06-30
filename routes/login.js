var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var SEED = require('../config/config').SEED,
    CLIENT_ID = require('../config/config').CLIENT_ID;

var app = express();

var Usuario = require('../models/user');

//Google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


//==================================================
// Autenticacion normal
//==================================================
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

//==================================================
// Autenticacion google
//==================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
  //verify().catch(console.error);

app.post('/google', async (req, res) => {

    let token = req.body.token,
        googleUser = await verify(token)
            .catch(e => {
                return res.status(403).json({
                    ok: false,
                    message: 'token invalido',
                    errors: e
                });
            });
    
    Usuario.findOne({email: googleUser.email}, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error searching user',
                errors: err
            });
        }

        if(userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'no google user, user normal autentication'
                });
            } else {
                var token = jwt.sign({usuario: userDB}, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id
                });
            }
        } else {
            //create a new user
            var usuario = new Usuario({
                name: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.picture,
                google: true,
                password: ':)'
            });
            
            usuario.save((err, newuserDB) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: 'error saving user',
                        errors: err
                    });
                } else {

                    var token = jwt.sign({usuario: newuserDB}, SEED, { expiresIn: 14400 });

                    res.status(200).json({
                        ok: true,
                        user: newuserDB,
                        token: token,
                        id: newuserDB._id
                    });
                }
            });
        }
    });
});

module.exports = app; 