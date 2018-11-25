var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
    var token = req.headers.authorization;
    if (!token)
        return res.status(403).json({
            auth: false,
            message: 'No token provided.'
        });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).json({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        
        req.body.userId = decoded.id;
        next();
    });
}
module.exports = verifyToken;