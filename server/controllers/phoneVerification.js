import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import getToken from '../config/tokenChecker';

const { User } = model;
require('../config/passport')(passport);
// require('dotenv').config();

const authy = require('authy')('OwxJ43qfI6XlEH6KnzGl3fBvHy1EcSag')

class PhoneVerifier {

    static sendPhoneVerificationCode(req, res) {
        let token = getToken(req.headers);
        const phone = req.body.phone;
        const country_code = req.body.country_code;
        const via = "sms";
        let authy_response = {};
        if (token) {
            authy.phones().verification_start(phone, country_code, via, function (error, response) {
                if (error) {
                    console.log(error);
                    authy_response = {
                        type: 'failed',
                        error: error
                    };
                } else {
                    console.log(response);
                    authy_response = {
                        type: 'success',
                        response: response
                    };
                }
            });
            
            if (authy_response.success === true ) {
                return res.status(200).send({
                    success:true,
                    message:'Verification Code send to your phone '
                });
            } else {
                return res.status(400).send({
                    success:false,
                    message:'Something is wrong'
                });
            }

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
        let authy_response = {};
        if (token) {
            authy.phones().verification_check(phone, country_code, verification_code, function (error, response) {
                if (error) {  
                    console.log(error);
                    authy_response = {
                        type: 'failed',
                        error: error
                    };
                    console.log(authy_response);
                } else {
                    console.log(response);
                    authy_response = {
                        type: 'success',
                        response: response
                    };
                    console.log(authy_response);
                }
            });
            if (authy_response.type === 'success') {
                return res.status(200).send(authy_response);
            } else {
                return res.status(400).send(authy_response);
            }
        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }
    }
}

export default PhoneVerifier;