const user = require('../models/user.js');
const hashPackage = require('bcrypt');

let signUp = (req, res) => {

    if (!req.body.email.match(/[<>/;'{}]+/) && !req.body.password.match(/[<>/;{}]+/)) {
        hashPackage.hash(req.body.password, 12).then((hash) => {
            new user({ email: req.body.email, password: hash }).save()

                .then(() => {
                    res.status(200).json({ message: 'Registration completed' });
                })
                .catch((error) => {
                    res.status(500).json(error);
                })

        }).catch((error) => {
            console.error(error, 'HASH ERROR !!')
            res.status(500).json(error);
        })
    }
    else {
        res.sendStatus(500);
    }
};
module.exports = signUp;