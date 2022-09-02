const sauceSchema = require('../models/sauce');
const imageFolder = require('fs');

exports.getSauces = (req, res, next) => {

    sauceSchema.find().then((data) => {
        res.status(200).json(data);
    })

        .catch((error) => {
            res.status(500).json(error);
        });
};

exports.getSaucesId = (req, res, next) => {

    sauceSchema.findById(req.params.id)
        .then((sauces) => { res.status(200).json(sauces); })
        .catch((error) => {
            res.status(500).json(error);
        });
};

exports.postSauces = (req, res, next) => {
    if (JSON.parse(req.body.sauce).userId === req.authorize.userId) {
        let sauceData = Object.assign(JSON.parse(req.body.sauce), {
            "imageUrl": req.protocol + '://' + req.get('host') + '/' + req.file.filename, likes: 0, dislikes: 0, userLiked: [], userDisliked: []
        });
        JSON.stringify(sauceData);

        new sauceSchema(sauceData).save()
            .then(() => {
                res.status(200).json({ message: 'Successful submission !' });
            })
            .catch((error) => {
                res.status(500).json(error);
            });
    }

    else {
        let error = new Error('Parsing error !');
        res.status(500).json({ message: error.message });
    }
};

exports.putSauces = (req, res, next) => {

    if (req.file !== undefined) {
        if (JSON.parse(req.body.sauce).userId === req.authorize.userId) {
            let newSauceData = Object.assign(JSON.parse(req.body.sauce), {
                "imageUrl": req.protocol + '://' + req.get('host') + '/' + req.file.filename, likes: 0, dislikes: 0, userLiked: [], userDisliked: []
            });
            JSON.stringify(newSauceData);

            sauceSchema.findById(req.params.id)

                .then((currentSauce) => {
                    imageFolder.unlink(process.cwd() + '/images/' + currentSauce.imageUrl.slice(22), (err) => {
                        if (err) {
                            console.error(err, 'Removal error');
                            res.status(500).json(err);
                        }
                    });

                    sauceSchema.findByIdAndUpdate(req.params.id, {
                        userId: newSauceData.userId,
                        name: newSauceData.name,
                        manufacturer: newSauceData.manufacturer,
                        description: newSauceData.description,
                        mainPepper: newSauceData.mainPepper,
                        imageUrl: newSauceData.imageUrl,
                        heat: newSauceData.heat,
                        likes: currentSauce.likes,
                        dislikes: currentSauce.dislikes,
                        usersLiked: currentSauce.usersLiked,
                        usersDisliked: currentSauce.usersDisliked
                    })

                        .then(() => {
                            res.status(200).json({ message: 'Successful update !' });
                        })
                        .catch((error) => {
                            res.status(500).json(error);
                        });
                })

                .catch((error) => {
                    res.status(500).json(error);
                });
        }

        else {
            let error = new Error('Parsing error !');
            res.status(500).json({ message: error.message });
        }

    }
    else if (req.file === undefined) {

        if (req.authorize.userId === req.body.userId) {
            let data = {
                userId: req.body.userId,
                name: req.body.name,
                manufacturer: req.body.manufacturer,
                description: req.body.description,
                mainPepper: req.body.mainPepper,
                heat: req.body.heat,
            };

            sauceSchema.findByIdAndUpdate(req.params.id, data)

                .then(() => {
                    res.status(200).json({ message: 'Successful update !' });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });
        }
    }
};

exports.deleteSauces = (req, res, next) => {

    sauceSchema.findById(req.params.id)
        .then((sauce) => {
            if (req.params.id === sauce._id.toString() && sauce.userId === req.authorize.userId) {

                imageFolder.readdir('images', (err, files) => {
                    if (err !== null) {
                        console.error(err, 'Directory error');
                        res.status(500).json(err);
                    }
                    else {

                        imageFolder.unlink(process.cwd() + '/images/' + sauce.imageUrl.slice(22), (err) => {
                            if (err) {
                                console.error(err, 'Removal error');
                                res.status(500).json(err);
                            }

                            sauceSchema.findByIdAndDelete(sauce._id)

                                .then(() => {

                                    res.status(200).json({ message: 'Successful deletion !' });

                                })
                                .catch((error) => {
                                    res.status(500).json({ message: error });

                                })
                        });
                    }

                });

            }

            else {

                res.status(401).json({ message: 'Deletion not allowed !' })
            }
        })
        .catch((error) => {
            res.status(500).json(error);
        })

};

exports.likeSauces = (req, res, next) => {

    let likes = sauceSchema.findById(req.params.id)
        .then((data) => {

            if (!data.usersLiked.includes(req.authorize.userId)) {

                if (req.body.like === 1) {

                    sauceSchema.updateOne({ name: data.name }, { likes: data.likes + 1, $push: { usersLiked: req.authorize.userId } }).then(() => {

                        res.status(201).json({ message: 'Successful registration!' })
                    })
                        .catch((error) => {
                            res.status(500).json(error);
                        })
                }

            }
            else {

                let pushedUser = data.usersLiked.find(element => element === req.authorize.userId);

                if (pushedUser === req.authorize.userId) {

                    if (data.userId !== req.authorize.userId) {
                        sauceSchema.updateOne({ name: data.name }, { likes: data.likes - 1, $pull: { usersLiked: pushedUser } })
                            .catch((error) => {
                                res.status(500).json(error);
                            })
                        res.status(200).json({ message: 'Successful cancelation !' })
                    }
                    else if (data.userId === req.authorize.userId) {
                        sauceSchema.updateOne({ name: data.name }, { likes: data.likes - 1, $pull: { usersLiked: pushedUser } })
                            .catch((error) => {
                                res.status(500).json(error);
                            })
                        res.status(200).json({ message: 'Successful cancelation !' })

                    }
                }
            }

        })
        .catch((error) => {
            res.status(500).json(error);
        });


    let dislikes = sauceSchema.findById(req.params.id)
        .then((data) => {

            if (!data.usersDisliked.includes(req.authorize.userId)) {

                if (req.body.like === -1) {

                    sauceSchema.updateOne({ name: data.name }, { dislikes: data.dislikes + 1, $push: { usersDisliked: req.authorize.userId } }).then(() => {

                        res.status(201).json({ message: 'Successful registration!' })
                    })
                        .catch((error) => {
                            res.status(500).json(error);
                        })
                }
            }
            else {

                let pushedUser = data.usersDisliked.find(element => element === req.authorize.userId);

                if (pushedUser === req.authorize.userId) {

                    if (data.userId !== req.authorize.userId) {

                        sauceSchema.updateOne({ name: data.name }, { dislikes: data.dislikes - 1, $pull: { usersDisliked: pushedUser } })
                            .catch((error) => {
                                res.status(500).json(error);
                            })
                        res.status(200).json({ message: 'Successful cancelation !' })
                    }
                    else if (data.userId === req.authorize.userId) {

                        sauceSchema.updateOne({ name: data.name }, { dislikes: data.dislikes - 1, $pull: { usersDisliked: pushedUser } })
                            .catch((error) => {
                                res.status(500).json(error);
                            })
                        res.status(200).json({ message: 'Successful cancelation !' })

                    }
                }
            }
        })
        .catch((error) => {
            res.status(500).json(error);
        });
};