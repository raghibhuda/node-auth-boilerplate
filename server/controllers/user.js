import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';
// import getToken from '../config/tokenChecker';
const { User} = model;
require('../config/passport')(passport);



class Users {
    static signUp(req, res) {
        const { name, username, email, password } = req.body;
        return User
            .create({
                name,
                email,
                password,
                username
            })
            .then(userData => res.status(201).send({
                success: true,
                message: 'User successfully created',
                userData
            }))
            .catch((error) => res.status(400).send(error));
    }

    static signIn(req, res) {
        return User
            .findOne({
                where: {
                    email: req.body.email
                }
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        message: 'Authentication failed. User not found.',
                    });
                }
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        let token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {
                            expiresIn: 86400 * 30
                        });
                        jwt.verify(token, 'nodeauthsecret', function (err, data) {
                            console.log(err, data);
                        });
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    } else {
                        res.status(401).send({
                            success: false,
                            msg: 'Authentication failed. Wrong password.'
                        });
                    }
                })
            })
            .catch((error) => res.status(400).send(error));
    }


   

}

export default Users;
