const mongoosePackage = require('mongoose');
const exportPackage = module;
const emailValidator = require('mongoose-unique-validator');
const userSchema = new mongoosePackage.Schema({
    email: { type: String, unique: true },
    password: { type: String }
});
userSchema.plugin(emailValidator);

const userModel = mongoosePackage.model('User', userSchema,);
exportPackage.exports = userModel;
