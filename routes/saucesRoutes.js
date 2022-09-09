const sauceRoute = require('express');
const authorizeFunction = require('../middlewares/authorization').authorize;
const saucesControllers = require('../controllers/sauces');
const uploadingImages = require('../middlewares/upload');
const sauces = sauceRoute.Router();

const getRoute = sauces.get('/', authorizeFunction, saucesControllers.getSauces);

const getIdRoute = sauces.get('/:id', authorizeFunction, saucesControllers.getSaucesId);

const postRoute = sauces.post('/', authorizeFunction, uploadingImages, saucesControllers.postSauces);

const putRoute = sauces.put('/:id', authorizeFunction, uploadingImages, saucesControllers.putSauces);

const deleteRoute = sauces.delete('/:id', authorizeFunction, saucesControllers.deleteSauces);

const postLikesRoute = sauces.post('/:id/like', authorizeFunction, saucesControllers.likeSauces);

module.exports = { getRoute, postRoute, getIdRoute, putRoute, deleteRoute, postLikesRoute };
