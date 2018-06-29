// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Initializa variables
var app = express();

// Body parser configuration
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Import routes
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var userRoutes = require('./routes/user');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imageRoutes = require('./routes/imagenes');


// Database connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Database is  \x1b[32m%s\x1b[0m', 'online');
});

// Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imageRoutes);
app.use('/', appRoutes);

// Listen express requests
app.listen(3000, () => {
    console.log('Express server running at port 3000 \x1b[32m%s\x1b[0m', 'online');
});