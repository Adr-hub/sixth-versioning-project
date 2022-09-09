const registeredUser = require('../models/user.js');
const bcrypt = require('bcrypt');
const randomKey = require('crypto');
const tokens = require('jsonwebtoken');

exports.login = (req, res) => {


    registeredUser.findOne({ email: req.body.email }).then((registered) => {

        if (!registered) {
            res.status(401).json({ message: 'You have to enter a valid email.' });
        }
        else {
            bcrypt.compare(req.body.password, registered.password).then((compared) => {
                if (compared) {

                    const secret = randomKey.randomBytes(32);
                    exports.secret = secret;

                    let token = tokens.sign({ userId: String(registered._id) }, secret, { expiresIn: '3h' });
                    res.status(201).json({ userId: String(registered._id), token: token });
                }

                else {

                    res.status(401).json({ message: 'You have to enter a valid password.' });
                }
            })
                .catch((error) => {
                    res.status(404).json({ message: error });
                });
        }
    })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
};