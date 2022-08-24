const user = require('../models/user.js');
const hashPackage = require('bcrypt');

let signUp = (req, res) => {

    if (!req.body.email.match(/[<>/;'{}]+/) && !req.body.password.match(/[<>/;{}]+/)) {
        hashPackage.hash(req.body.password, 12).then((hash) => {
            new user({ email: req.body.email, password: hash })

                .validate((error) => {

                    if (error !== null) {
                        res.sendStatus(500);
                    }
                    else {
                        new user({ email: req.body.email, password: hash }).save()
                            .then(() => {
                                res.json({ message: 'Registration completed' }).status(200);
                            })
                            .catch((error) => {
                                res.send(error.message).status(500);
                            })
                    }
                })
        }).catch((error) => {
            console.error(error, 'HASH ERROR !!')
        })
    }
    else {
        res.sendStatus(500);
    }
};
module.exports = signUp;