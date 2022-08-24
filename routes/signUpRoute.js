const expressRoutes = require('express');
const user = require('../models/user');
const registration = require('../controllers/signUp');
const route = expressRoutes.Router();
module.exports = route.post('/signup', registration);