var jwt = require('jsonwebtoken');
var config = require('../config');
const User = require("../models/user");

function checkAdmin(req, res, next) {
    User.findOne({ _id: req.userId }, (err, user) => {
        if (user && user.role.toLowerCase() === 'admin') {
            next();
        }
        else {
            return res.status(403).json({
                auth: false,
                message: 'No token provided.'
            });
        }
    });
}
module.exports = checkAdmin;