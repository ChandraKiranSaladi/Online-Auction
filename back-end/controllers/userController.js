const User = require('../models/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
// const verifyToken = require('../auth/VerifyToken');
const config = require('../config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

var signJWT = function (user) {
    return jwt.sign({
        id: user._id,
        role: user.role,
        name: `${user.name.firstname} ${user.name.lastname}`,
        email: user.email
    }, config.secret, {
            expiresIn: "1h"
        });
}

//user
exports.create = (req, res, next) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) return sendErrorMessage(res, {
            bcrypt: "error"
        });
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
                var token = signJWT(user);
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
                return sendErrorMessage(res, {
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
        if (!user) return sendErrorMessage(res, {
            noUser: "noUser"
        });

        bcrypt.compare(req.body.password, user.hash, (err, result) => {
            if (result) {
                var token = signJWT(user);
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
    // verifyToken(req, res, next);
    if (!req.userId)
        return;
    User.findByIdAndUpdate(req.userId, {
        lastActivity: new Date()
    },
        (err, user) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "error on server",
                error: {
                    message: 'Couldn\'t access database for the user'
                }
            });
            if (!user) return sendErrorMessage(res, {
                noUser: "noUser"
            });
            console.log("logged out");
            return res.status(200).json({
                status: "success",
                message: "User logged off",
                data: {
                    auth: "false",
                    token: null
                },
                error: []
            })
        }

    );

};

//working
exports.profile = (req, res, next) => {
    // verifyToken(req, res, next);
    if (!req.userId)
        return;
    User.findOne({
        _id: req.userId
    },
        (err, user) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "error on server",
                error: {
                    message: 'Couldn\'t access database for the user'
                }
            });
            if (!user) return sendErrorMessage(res, {
                noUser: "noUser"
            });
            console.log("user details found" + user.email);
            return res.status(200).json({
                status: "success",
                message: "User Details",
                data: {
                    email: user.email,
                    name: {
                        firstname: user.name.firstname,
                        lastname: user.name.lastname,
                    },
                },
                error: []
            })
        }

    );

};

//needs work
exports.passwordReset = (req, res, next) => {

    var randomHash = '';
    crypto.randomBytes(20, function (err, buf) {
        randomHash = buf.toString('hex');
        if (err) console.log("crypto error");
    });

    User.findOne({
        email: req.body.email
    },
        (err, user) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "Server failure, please try after sometime.",
                error: {
                    message: "Server failure, please try after sometime."
                }
            });
            if (!user) return sendErrorMessage(res, {
                noUser: "noUser"
            });
            console.log("user details found");
            user.resetPasswordToken = randomHash;
            user.resetPasswordExpires = Date.now() + 600; // 5 minutes

            User.findOneAndUpdate({ email: user.email }, user, { upsert: true })
                .then((doc) => {
                    console.log("reset token saved");
                })
                .catch((err) => {
                    console.log("error " + err);
                });

            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'kiran1ck18@gmail.com',
                    pass: 'myfutureawaits'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@auctioneo.com',
                subject: 'Account Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'https://localhost:4200/reset/' + randomHash + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                    return sendErrorMessage(res, {
                        mailerror: "mail"
                    });
                };
                console.log("Email sent");
                return res.status(200).json({
                    status: "success",
                    message: "Mail sent to " + user.email,
                    error: []
                });
            });
        }

    );
    // reset link and then updateById.
}

exports.passwordResetGet = (req, res, next) => {
    //, resetPasswordExpires: { $gt: Date.now() }
    User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "Reset link is not valid",
                error: [{ message: "Password reset token is invalid or has expired" }]
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Ok",
            error: []
        });
    });

}

exports.passwordResetPost = (req, res, next) => {
    //, resetPasswordExpires: { $gt: Date.now() } 
    User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
        console.log("postreset: " + err);
        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "Reset link is not valid",
                error: [{ message: "Password reset token is invalid or has expired" }]
            });
        }

        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) return sendErrorMessage(res, {
                bcrypt: "error"
            });
            console.log(req.body);

            user.hash = hash;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
                if (err) {
                    console.log("error in resetpasswordpost");
                    res.status(500).json({
                        status: "failed",
                        message: "error",
                        error: [{ message: "error occured while changing" }]
                    });
                }
                console.log("passsword changed");
                res.status(201).json({
                    status: "success",
                    message: "Changed",
                    error: []
                });
            })
        });
    });
}
// except password update
exports.update = (req, res, next) => {

    // verifyToken(req, res, next);
    if (!req.userId)
        return;

    User.findByIdAndUpdate(req.userId, {
        name: {
            firstname: req.body.name.firstname,
            lastname: req.body.name.lastname,
        }
    },
        (err, user) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "error on server",
                error: {
                    message: 'Couldn\'t access database for the user'
                }
            });
            if (!user) return sendErrorMessage(res, {
                noUser: "noUser"
            });
            console.log("Updated details");
            return res.status(200).json({
                status: "success",
                message: "updated details",
                error: []
            });
        }

    );
}

exports.updatePassword = (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) return sendErrorMessage(res, {
            bcrypt: "error"
        });
    });
    res.send("dummy");
};
exports.getById = (req, res, next) => {
    User.findOne({_id: req.userId}, (err,user) => {
        if(err)  return res.status(200).json({
            status: "failed",
            message: "user details could not be found",
            error: {"message": "user does not exist"}
        });
        return res.status(200).json({
            status: "success",
            message: "user details found",
            data: user,
            error: []
        });
        
    });
};
exports.updateById = (req, res, next) => {
    res.send("dummy");
};

exports.deleteById = (req, res, next) => {
    res.send("dummy");
};

//Needs testing
exports.admin_getAllUsers = (req, res, next) => {
    // To-Do: implement admin check...

    // verifyToken(req, res, next);
    if (!req.userId)
        return;
    User.findOne({
        _id: req.userId
    },
        (err, user) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "error on server",
                error: {
                    message: 'Couldn\'t access database for the user'
                }
            });
            if (!user) return sendErrorMessage(res, {
                noUser: "noUser"
            });
            console.log("user details found" + user);
            if (user.role !== "admin")
                return sendErrorMessage(res, {
                    noUser: "noUser"
                });

            User.find({}, function (err, users) {
                var userMap = {};

                users.forEach(function (user) {
                    userMap[user._id] = user;
                });

                res.status(200).json({
                    status: "success",
                    message: "List of all users",
                    data: userMap,
                    error: []
                });
            });
        });

};

function sendErrorMessage(res, err) {
    if (err.failed) {
        // when credentials provided are incorrect
        console.log("credentials are wrong");
        return res.status(401).json({
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
        return res.status(401).json({
            status: "failed",
            message: "Use another email",
            error: {
                message: "email already exists"
            }
        });
    } else if (err.noUser) {
        // no user exists 
        console.log("user does not exist");
        return res.status(404).json({
            status: "failed",
            message: "login failed",
            error: {
                message: "no user with email exists"
            }
        });
    } else if (err.mailerror) {
        // no user exists 
        console.log("smtptransport sendmail error");
        return res.status(404).json({
            status: "failed",
            message: "password reset failed",
            error: {
                message: "Unable to send mail"
            }
        });
    } else if (err.bcrypt) {
        // no user exists 
        console.log("bcrypt error");
        return res.status(500).json({
            status: "failed",
            message: "bcrypt",
            error: {
                message: "Unable to save user"
            }
        });
    }
}