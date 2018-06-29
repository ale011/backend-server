var express = require('express');
const path = require('path'),
  fs = require('fs');

var app = express();

//Routes
app.get('/:tipo/:img', (req, res, next) => {

    var img = req.params.img,
      tipo = req.params.tipo;


      let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

      if (fs.existsSync(pathImagen)) {
          res.sendFile(pathImagen);
      } else {
          let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
          res.sendFile(pathNoImage);
      }

    /*res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente para ver imagenes',
        pathImagen: pathImagen
    });*/
});

module.exports = app;