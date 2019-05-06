import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import getToken from '../config/tokenChecker';

const { User } = model;
require('../config/passport')(passport);
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');


class Authenticator {
    static qrCodeGenerator(req, res) {
        const token = getToken(req.headers);
        const getCurrentUser = jwt.decode(token);
        let userEmail = getCurrentUser.email;

        if (token) {

            let secret = speakeasy.generateSecret({
                length: 20
            });

            return User
                .update({ googel_2fa_secret: secret.base32 }, { where: { email: userEmail } })
                .then((user) => {
                    if (!user) {
                        return res.status(401).send({
                            status: 'failed',
                            message: 'User not found!'
                        });
                    } else {
                        QRCode.toDataURL(secret.otpauth_url, function (err, image_data) {
                            if (!err) {
                                console.log("Image Data: ", image_data);
                                return res.status(200).send(image_data);
                            } else {
                                console.log(err);
                                return res.status(400).send(err);
                            }
                        });
                    }
                })
                .catch((error) => res.status(400).send(error));

        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }
    }
    static async verifyGoogleAuthenticatorCode(req, res) {

        const google_verification_code = req.body.google_verification_code;
        const  email = req.body.email
        let user = await User
            .findOne({ where: { email: email } })
            .then((user) => {
                if (!user) {
                    return null;
                } else {
                    return user;
                }
            })
            .catch((error) => console.log(error));
        let secret = user.dataValues.googel_2fa_secret;

        let verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: google_verification_code
        });

        if (!verified) {
            return res.status(400).send({
                message: 'Code not verified',
                data: verified,
                secret: secret
            });
        } else {
            return res.status(200).send({
                message: 'Verified!!!!!!!!!!!!',
                secret: secret
            });
        }
    }
}


export default Authenticator;