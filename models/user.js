const mongoosePackage = require('mongoose');
const emailValidator = require('mongoose-unique-validator');
const userSchema = new mongoosePackage.Schema({
    email: { type: String, unique: true },
    password: { type: String }
});
userSchema.plugin(emailValidator);

module.exports = mongoosePackage.model('User', userSchema);

