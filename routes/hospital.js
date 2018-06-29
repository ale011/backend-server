var express = require('express');
var mdAuth = require('../middlewares/authentication');

var app = express();

var Hospital = require('../models/hospital');

//Routes
app.get('/', (req, res, next) => {
  var skip = req.query.skip || 0;
  skip = Number(skip);

  Hospital.find({}, 'id nombre img usuario')
    .skip(skip)
    .limit(5)
    .populate('usuario', 'name email')
    .exec((err, hospitales) => {
      if (err) {
        res.status(500).json({
          ok: false,
          message: 'database error -  hospitales',
          errors: err
        });
      }

      Hospital.count({}, (err, total) => {
        return res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: total
        });
      });
    });
});

//============================================
// Create new hospital
//============================================

app.post('/', mdAuth.verifyToken, (req, res) => {

  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.logedInUser._id
  });

  hospital.save((err, savedHospital) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'Error saving user',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: savedHospital,
    });
  });
});

//============================================
// Update hospital
//============================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {
  let id = req.params.id,
    body = req.body;
  
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "error searching hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "The hospital with id: " + id + " was not found"
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.logedInUser._id;

    hospital.save((err, savedHospital) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error trying to update hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: savedHospital
      });
    });

  });
  
});

//============================================
// Delete a hospital
//============================================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {
  let id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, deletedHospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "error deleting hospital",
        errors: err
      });
    }

    if (!deletedHospital) {
      return res.status(404).json({
        ok: false,
        message: "hospital not found"
      });
    }

    res.status(200).json({
      ok: true,
      hospital: deletedHospital
    });
  });
});

module.exports = app;