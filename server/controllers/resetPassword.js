import model from '../models';
import passport from 'passport';
import timeChecker from '../config/timeDifference';
import crypto from 'crypto-random-string';
import verificationEmail from './sendEmail';

const { User, VerificationToken } = model;
require('../config/passport')(passport);

class PasswordReseter {

    static requestPasswordReset(req, res) {
        return User
            .findOne({
                where: {
                    email: req.body.email
                }
            }).then((user) => {
                if (!user) {
                    return res.status(201).send({
                        success: false,
                        message: 'Your account not found in the system'
                    })
                } else {
                    let verifiyToken = crypto(20);
                    return VerificationToken
                        .create({
                            userId: user.id,
                            token: verifiyToken
                        }).then(() => {
                            verificationEmail(req.body.email, verifiyToken);
                            return res.status(201).send({
                                success: true,
                                message: 'Password reset mail sent to your email'
                            })
                        }).catch((error) => res.status(400).send(error));
                }
            }).catch((error) => res.status(400).send(error));
    }



    static resetPassword(req, res) {
        return User
            .findOne({
                where: {
                    email: req.query.email
                }
            }).then((user) => {
                return VerificationToken
                    .findOne({
                        where: {
                            token: req.query.token
                        }
                    }).then((foundToken) => {
                        if (foundToken && timeChecker(foundToken.createdAt) < 5) {
                            return user.update({
                                password: req.body.newpassword
                            }).then(() => {
                                return VerificationToken
                                    .destroy({
                                        where: {
                                            userId: user.id
                                        }
                                    }).then(() => res.status(201).send({
                                        success: true,
                                        message: 'Password reset successfully'
                                    }))
                                    .catch((error) => res.status(401).send(error));
                            })
                                .catch((error) => res.status(401).send(error));
                        } else {
                            return res.status(401).send({
                                success: false,
                                message: 'Token expired'
                            })
                        }
                    })
                    .catch((error) => res.status(401).send(error));
            })
    }
}

export default PasswordReseter;