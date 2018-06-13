var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

var usuarioSchema = new Schema({
    name: { type: String, required: [true, 'Name is mandatory'] },
    email: { type: String, unique: true, required: [true, 'Email is mandatory'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles }
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} must be uniuqe'});

module.exports = mongoose.model('Usuario', usuarioSchema);