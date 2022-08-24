const registeredUser = require('../models/user.js');
const randomSecretKey = require('crypto');
const bcrypt = require('bcrypt');
const tokens = require('jsonwebtoken');
let login = (req, res) => {

    registeredUser.findOne({ email: req.body.email }).then((registered) => {

        if (registered === undefined || registered === null) {
            res.sendStatus(500);
        }
        else {
            bcrypt.compare(req.body.password, registered.password).then((compared) => {
                randomSecretKey.randomBytes(32, (err, buff) => {
                    let secret = buff;
                    if (compared && err === null) {

                        let token = tokens.sign({ userId: String(registered._id) }, secret, { expiresIn: '3h' });
                        res.json({ userId: String(registered._id), token: token }).status(200);
                    }

                    else {
                        console.error(err, 'Buffer error ?');
                        res.sendStatus(400);
                    }
                })
            })
                .catch((error) => {
                    res.send(error).status(404);
                })
        }
    })
        .catch((error) => {
            res.send(error).status(500);
        })

}



module.exports = login;