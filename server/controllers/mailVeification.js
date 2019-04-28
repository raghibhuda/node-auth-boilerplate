import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import getToken from '../config/tokenChecker';
import crypto from 'crypto-random-string';
import verificationEmail from './sendEmail';


const { User, VerificationToken } = model;
require('../config/passport')(passport);

class Verifier {

    static requestVerification(req, res) {
        let token = getToken(req.headers);
        if (token) {
            const getCurrentUser = jwt.decode(token);
            let userId = getCurrentUser.id;
            let userEmail = getCurrentUser.email;
            let verifiyToken = crypto(16);
            return VerificationToken
                .create({
                    userId: userId,
                    token: verifiyToken
                })
                .then(() => {
                    verificationEmail(userEmail, verifiyToken);
                    return res.status(201).send({
                        success: true,
                        message: 'verification mail sent and token created'
                    })
                }).catch((error) => res.status(400).send(error));
        }
    }

    static verifiyEmailRequest(req, res) {
        return User
            .findOne({
                where: {
                    email: req.query.email
                }
            }).then(user => {
                if (user.email_verified) {
                    return res.status(201).send({
                        success: true,
                        message: 'Email already verified'
                    })
                } else {
                    return VerificationToken
                        .findOne({
                            where: {
                                token: req.query.token
                            }
                        }).then((foundToken) => {
                            if (foundToken) {
                                return user
                                    .update({
                                        email_verified: true
                                    })
                                    .then(updatedUser => {
                                        return res.status(201).send({
                                            success: true,
                                            message: 'User email verified',
                                            updatedUser
                                        });
                                    }).catch((error) => res.status(401).send(error));
                            } else {
                                return res.status(401).send({
                                    success: false,
                                    message: 'Token expired'
                                })
                            }
                        })
                        .catch((error) => res.status(401).send(error));

                }
            })
    }

    static modifiedVerification(req, res) {
        return User
            .findOne({
                where: {
                    email: req.query.email
                }
            }).then((user) => {
                if (user.email_verified) {
                    return res.status(201).send({
                        success: true,
                        message: 'Email already verified'
                    });
                } else {
                    return VerificationToken
                        .findOne({
                            where: {
                                token: req.query.token
                            }
                        }).then((foundToken) => {
                            console.log(foundToken,"==========token found=========");
                            if (foundToken) {
                                return user
                                    .update({
                                        email_verified: true
                                    }).then((updatedUser) => {
                                        return VerificationToken
                                            .destroy({
                                                where: {
                                                    userId: updatedUser.id
                                                }
                                            }).then((response) => {
                                                return res.status(201).send({
                                                    success: true,
                                                    message: 'User email verified',
                                                    response
                                                });
                                            }).catch((error) => res.status(401).send(error));
                                    }).catch((error) => res.status(401).send(error));
                            } else {
                                return res.status(401).send({
                                    success: false,
                                    message: 'Token expired'
                                })
                            }
                        }).catch((error) => res.status(401).send(error));
                }
            })
    }

}

export default Verifier;