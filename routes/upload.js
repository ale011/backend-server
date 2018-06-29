const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

// Import models
const Usuario = require('../models/user'),
  Medico = require('../models/medico'),
  Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

//Routes
app.put('/:tipo/:id', (req, res, next) => {

    let tipo = req.params.tipo,
      id = req.params.id;
    
    // Allowed collections
    let tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'invalid collection type'
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'no file selected',
            errors: {message: 'must select an image'}
        });
    }
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.imagen,
      nombreCortado = archivo.name.split('.'),
      extensionArchivo = nombreCortado[nombreCortado.length -1];

    // Allowed extensions
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: 'invalid file extension. mus be one of: ' + extensionesValidas.join(', ')
        });
    }

    // Custom file name
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`
 
    // Use the mv() method to place the file somewhere on your server

    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'can not move file',
                errors: err
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res)
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var oldPath = './uploads/usuarios/'+usuario.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, savedUser) => {
                return res.status(200).json({
                    ok: true,
                    message: 'user image updated',
                    usuario: savedUser
                });
            });
        });

    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            var oldPath = './uploads/medicos/' + medico.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            medico.img = nombreArchivo;

            medico.save((err, savedMedico) => {
                return res.status(200).json({
                    ok: true,
                    message: 'medico image updated successfuly',
                    medico: savedMedico
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            var oldPath = './uploads/hospitales/' + hospital.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, savedHospital) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Hospital image updated successfuly',
                    hospital: savedHospital
                });
            });
        });
    }
}

module.exports = app;