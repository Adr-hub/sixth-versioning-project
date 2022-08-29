const sauceSchema = require('../models/sauce');
const imageFolder = require('fs');

exports.getSauces = (req, res, next) => {

    sauceSchema.find({ userId: req.authorize.userId }).then((data) => {
        res.status(200).json(data);
    })

        .catch((error) => {
            res.status(500).json(error);
        })
};

exports.getSaucesId = (req, res, next) => {


    sauceSchema.findById(req.params.id)
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(500).json(error);
        })
};

exports.postSauces = (req, res, next) => {
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
        })
};

exports.deleteSauces = (req, res, next) => {

    sauceSchema.findById(req.params.id)
        .then((sauce) => {
            if (req.params.id === sauce._id.toString() && sauce.userId === req.authorize.userId) {

                imageFolder.readdir('images', (err, files) => {
                    if (err !== null) {
                        console.error(err, 'Directory error');
                    }
                    else {

                        imageFolder.unlink(process.cwd() + '/images/' + sauce.imageUrl.slice(22), (err) => {
                            if (err) {
                                console.error(err, 'Removal error');
                            }

                            sauceSchema.findByIdAndDelete(sauce._id)

                                .then(() => {

                                    res.status(200).json({ message: 'Successful deletion !' })

                                })
                                .catch((error) => {
                                    res.status(500).json({ message: error })

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