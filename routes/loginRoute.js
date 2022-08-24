const loginRoute = require('express');
const schema = require('../models/user');
const validation = require('../controllers/login');
const authentication = loginRoute.Router();
module.exports = authentication.post('/login', validation);
