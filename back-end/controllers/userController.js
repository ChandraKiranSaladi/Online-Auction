const User = require('../models/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const verifyToken = require('../auth/VerifyToken');
const config = require('../config');

//user
exports.create = (req, res, next) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log(req.body);

        const user = new User({
            email: req.body.email,
            name: {
                firstname: req.body.name.firstname,
                lastname: req.body.name.lastname
            },
            hash: hash,
            role: "user",
            created: new Date(),
            lastActivity: "today"
        });

        user.save()
            .then((result) => {
                console.log("User created");
                var token = jwt.sign({
                    id: result._id
                }, config.secret, {
                    expiresIn: '1h'
                });
                res.status(201).json({
                    status: "success",
                    message: "User create successful",
                    data: {
                        auth: "true",
                        token: token
                    },
                    error: []
                });
            })
            .catch((error) => {
                console.log("error from mongo" + error);
                sendErrorMessage(res,{
                    userRegistration: "failed"
                });
            });
    });
};

exports.login = (req, res, next) => {
    // user details
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) return res.status(500).json({
            status: "failed",
            message: "error on server",
            error: {
                message: 'Couldn\'t access database for the user'
            }
        });
        if (!user) sendErrorMessage(res,{
            noUser: "noUser"
        });

        bcrypt.compare(req.body.password, user.hash, (err, result) => {
            if (result) {
                var token = jwt.sign({
                    id: user._id
                }, "warrior", {
                    expiresIn: "1h"
                });
                console.log("user login succesful");
                res.status(200).json({
                    status: 'success',
                    message: {
                        auth: true,
                        token: token
                    },
                    error: []
                });
            }
        });
    })

}
exports.logout = (req, res, next) => {
    // user details
    res.send("dummy");
};
exports.getById = (req, res, next) => {
    res.send("dummy");
};
exports.updateById = (req, res, next) => {
    res.send("dummy");
};
exports.deleteById = (req, res, next) => {
    res.send("dummy");
};
exports.admin_getAllUsers = (req, res, next) => {
    // To-Do: implement admin check...
    res.send("dummy");
};


function sendErrorMessage(res,err) {
    if (err.failed) {
        // when credentials provided are incorrect
        console.log("credentials are wrong");
        return res.status(400).json({
            status: "failed",
            message: "authorization failed",
            error: {
                auth: "false",
                message: " credentials incorrect"
            }
        });
    } else if (err.userRegistration) {
        // user already exists 
        console.log("user already exists");
        return res.status(400).json({
            status: "failed",
            message: "Use another email",
            error: {
                message: "email already exists"
            }
        });
    } else if (err.noUser) {
        // no user exists 
        console.log("user already exists");
        return res.status(400).json({
            status: "failed",
            message: "login failed",
            error: {
                message: "no user with email exists"
            }
        });
    }
}