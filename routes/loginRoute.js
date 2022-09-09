const loginRoute = require('express');
const validation = require('../controllers/login').login;
const authentication = loginRoute.Router();
module.exports = authentication.post('/login', validation);
