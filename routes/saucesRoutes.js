const sauceRoute = require('express');
const authorizeFunction = require('../middleware/authorization');
const saucesControllers = require('../controllers/routes');
const uploadingImages = require('../middleware/upload');
const sauces = sauceRoute.Router();

const getRoute = sauces.get('/', authorizeFunction, saucesControllers.getSauces);

const getIdRoute = sauces.get('/:id', authorizeFunction, saucesControllers.getSaucesId);

const postRoute = sauces.post('/', authorizeFunction, uploadingImages, saucesControllers.postSauces);

// const putRoute = sauces.put('/:id', authorizeFunction, uploadingImages);

const deleteRoute = sauces.delete('/:id', authorizeFunction, saucesControllers.deleteSauces);

// const postLikesRoute = sauces.post('/:id/like', authorizeFunction);

module.exports = { getRoute, postRoute, getIdRoute, deleteRoute };
