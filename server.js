const httpProtocol = require('http');
const dotenv = require('dotenv').config();
const express = require('express');
const expressFramework = express();
const mongooseModule = require('mongoose');
const signUpModule = require('./routes/signUpRoute');
const loginModule = require('./routes/loginRoute');
const saucesMiddlewares = require('./routes/saucesRoutes');
let databaseUserName = process.env.MONGODB_USERNAME;
let databasePassword = process.env.MONGODB_PASSWORD;
let clusterName = process.env.MONGODB_CLUSTER_NAME;
const static = express.static('images', { index: false });
const json = express.json();

mongooseModule.connect('mongodb+srv://' + databaseUserName + ':' + databasePassword + '@' + clusterName + '.mongodb.net/Piiquante?retryWrites=true&w=majority')
    .then(function () {
        console.log('Connection succeeded !');
    })
    .catch(function (error) {
        console.error(error, 'Connection error !');
    });

expressFramework.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

expressFramework.use('/', json);
expressFramework.use(static);

expressFramework.use('/api/auth', signUpModule, loginModule);

expressFramework.use('/api/sauces', saucesMiddlewares.getRoute, saucesMiddlewares.getIdRoute, saucesMiddlewares.postRoute, saucesMiddlewares.putRoute, saucesMiddlewares.deleteRoute, saucesMiddlewares.postLikesRoute);

const expressServer = httpProtocol.createServer(expressFramework).listen(3000);
expressServer.on('error', (err) => {
    console.error(err, 'Server connection error !');
});