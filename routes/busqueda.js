var express = require('express'),
  app = express(),
  Hospital = require('../models/hospital'),
  Medico = require('../models/medico'),
  Usuario = require('../models/user');


//Routes
app.get('/coleccion/:coleccion/:busqueda', (req, res, next) => {

    var coleccion = req.params.coleccion,
        busqueda = req.params.busqueda,
        regex = new RegExp(busqueda, 'i'),
        promise;

    switch(coleccion) {
        case 'hospitales':
            promise = buscarHospital(busqueda, regex);
            break;
        case 'usuarios':
            promise = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promise = buscarMedicos(busqueda, regex);
            break;
        default:
            return res.status(404).json({
                ok: false,
                message: 'collection no t found'
            });
    }

    promise.then(data => {
        return res.status(200).json({
            ok: true,
            [coleccion]: data
        });
    });
});
app.get('/todo/:busqueda', (req, res, next) => {

    let busqueda = req.params.busqueda;

    let regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospital(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)]).then(response => {
        res.status(200).json({
            ok: true,
            hospitales: response[0],
            medicos: response[1],
            usuarios: response[2]
        });
    });
});

function buscarHospital(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital
        .find({ nombre: regex })
        .populate('usuario', 'name email')
        .exec((err, hospitales) => {
            if (err) {
                reject('error looking for hospitals', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico
        .find({ nombre: regex })
        .populate('usuario', 'name email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                reject('error looking for medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario
        .find({}, 'name email role')
        .or([{'name': regex}, {'email': regex}])
        .exec((err, usuarios) => {
            if (err) {
                reject('error looking for usuarios', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}

module.exports = app;