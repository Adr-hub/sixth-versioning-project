const user = require('../models/user.js');
const hashPackage = require('bcrypt');

exports.signUp = (req, res) => {

    if (!req.body.email.match(/[<>/;'{}]+/) && !req.body.password.match(/[<>/;{}]+/)) {
        hashPackage.hash(req.body.password, 12).then((hash) => {
            new user({ email: req.body.email, password: hash }).save()

                .then(() => {
                    res.status(201).json({ message: 'Registration completed' });
                })
                .catch((error) => {
                    res.status(400).json(error);
                });

        }).catch((error) => {
            console.error(error, 'Hash error !');
            res.status(500).json(error);
        });
    }
    else {
        let error = new Error('Registration error !');
        res.status(500).json({ message: error.message });
    }
};