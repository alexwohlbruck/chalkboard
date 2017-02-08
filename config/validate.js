var validate = require('mongoose-validator');
var errors = require.main.require('./config/errors.js');

// Validation module: https://github.com/leepowellcouk/mongoose-validator
// List of built-in validators: https://github.com/chriso/validator.js/#validators

module.exports = {
    alphanumeric: validate({validator: 'isAlphanumeric', passIfEmpty: false, message: errors.validate.alphanumeric('Username')}),
    email: validate({validator: 'isEmail', passIfEmpty: false, message: errors.validate.email})
};