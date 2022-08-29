const tokenCheck = require('jsonwebtoken');

let authorize = (req, res, next) => {

    try {
        let userToken = req.get('Authorization');

        if (userToken !== undefined) {
            let key = require('../controllers/login').secret;
            tokenCheck.verify(userToken.slice(7), key, (err, decoded) => {
                if (err) {
                    res.status(403).json({ message: err });
                }

                else {
                    req.authorize = {
                        userId: decoded.userId
                    }
                }
            });
        }
        next();
    }
    catch (e) {
        res.status(403).json({ message: e });
    }
}

module.exports = authorize;