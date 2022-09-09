const expressRoutes = require('express');
const registration = require('../controllers/signUp').signUp;
const route = expressRoutes.Router();
module.exports = route.post('/signup', registration);