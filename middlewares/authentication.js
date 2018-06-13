var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//============================================
// Verify token
//============================================

exports.verifyToken = function(req, res, next) {
  var token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'invalid token',
        errors: err
      });
    }

    req.logedInUser = decoded.usuario

    next();

    //res.status(200).json({
    //    ok: true,
    //    decoded: decoded
    //});

  });
}