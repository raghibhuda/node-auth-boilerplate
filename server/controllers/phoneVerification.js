require('dotenv').config();
import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import getToken from '../config/tokenChecker';

const { User } = model;
require('../config/passport')(passport);

const authy = require('authy')(process.env.AUTHY_API_KEY)

class PhoneVerifier {

    static sendPhoneVerificationCode(req, res) {
        let token = getToken(req.headers);
        const phone = req.body.phone;
        const country_code = req.body.country_code;
        const via = "sms";
        if (token) {
            const getCurrentUser = jwt.decode(token);
            let userId = getCurrentUser.id;
            return User
                .findOne({
                    where: {
                        id: userId
                    }
                }).then((user) => {
                    if (user.phone_verified === true) {
                        return res.status(201).send({
                            success: true,
                            message: 'Phone number already verifed'
                        })
                    } else {
                        authy.phones().verification_start(phone, country_code, via, function (error, response) {
                            if (error) {
                                console.log(error);
                                return res.status(401).send({
                                    success: false,
                                    message: 'Something went wrong.....',
                                    error: error
                                })

                            } else {
                                console.log(response);
                                return res.status(200).send({
                                    success: true,
                                    message: 'Verification Code send to your phone ',
                                    response: response
                                })
                            }
                        });
                    }
                })
                .catch((error) => res.status(401).send(error));

        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }
    }



    static phoneVerification(req, res) {
        let token = getToken(req.headers);
        const phone = req.body.phone;
        const country_code = req.body.country_code;
        const verification_code = req.body.verification_code;
        let phoneNumber = country_code + phone;

        if (token) {
            const getCurrentUser = jwt.decode(token);
            let userId = getCurrentUser.id;
            let authy_response = {};

            let userVerification = () => {
                return User
                    .findOne({
                        where: {
                            id: userId
                        }
                    }).then((user) => {
                        return user
                            .update({
                                phone_verified: true,
                                phone_number: phoneNumber
                            }).then(response => {
                                return res.status(200).send({
                                    success: true,
                                    message: 'Phone verified successfully',
                                    response
                                });
                            })
                            .catch((error) => res.status(401).send(error));
                    })
                    .catch((error) => res.status(401).send(error));
            }

            authy.phones().verification_check(phone, country_code, verification_code, function (error, response) {
                if (error) {
                    authy_response = {
                        type: 'failed',
                        error: error
                    };
                    return authy_response;
                } else {
                    console.log(response);
                    authy_response = {
                        type: 'success',
                        response: response
                    };
                    userVerification();
                    return authy_response;
                }
            });


        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }
    }

    


}

export default PhoneVerifier;

