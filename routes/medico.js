var express = require('express'),
  mdAuth = require('../middlewares/authentication'),
  app = express(),
  Medico = require('../models/medico');

// Routes
app.get('/', (req, res, next) => {

  var skip = req.query.skip || 0;
  skip = Number(skip);

  Medico.find({}, 'nombre img usuario hospital')
  .skip(skip)
  .limit(5)
  .populate('usuario', 'name email')
  .populate('hospital')
  .exec((err, medicos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Server error retrieving medicos',
        errors: err
      });
    }

    Medico.count({}, (err, total) => {
        res.status(200).json({
            ok: true,
            medcos: medicos,
            total: total
          });
    });
  });
});

//============================================
// Create a new medico
//============================================
app.post('/', mdAuth.verifyToken, (req, res) => {
  let body = req.body;

  let medico = new Medico({
    nombre: body.nombre,
    img: body.img,
    usuario: req.logedInUser._id,
    hospital: body.hospital
  });

  medico.save((err, savedMedico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error saving medico',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      message: 'medico saved correctly',
      savedMedico: savedMedico
    });
  });
});

//============================================
// Create a new medico
//============================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {
  let id = req.params.id,
    body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'an error occurred',
        errors: err
      });
    }

    if (!medico) {
      return res.status(404).json({
        ok: false,
        message: 'medico not found'
      });
    }

    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.usuario = req.logedInUser._id;
    medico.hospital = body.hospital;

    medico.save((err, savedMedico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: 'error updating medico',
          erros: err
        });
      }

      res.status(200).json({
        ok: true,
        message: 'medico updated successfully',
        medico: savedMedico
      });
    });
  });
});

//============================================
// Delete a medico
//============================================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {
    let id = req.params.id;
  
    Medico.findByIdAndRemove(id, (err, deletedMedico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "error deleting medico",
          errors: err
        });
      }
  
      if (!deletedMedico) {
        return res.status(404).json({
          ok: false,
          message: "medico not found"
        });
      }
  
      res.status(200).json({
        ok: true,
        medico: deletedMedico
      });
    });
  });

module.exports = app;