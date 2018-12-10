var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {

    var token = req.headers.authorization;
    if (!token)
        return res.status(401).json({
            auth: false,
            message: 'No token provided.'
        });

    token = token.replace('Bearer ','');
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).json({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        req.userId = decoded.id;
        req.role = decoded.role;
        req.name = decoded.name;
        req.email = decoded.email;
        next();
    });
}
module.exports = verifyToken;