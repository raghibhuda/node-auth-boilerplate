import model from '../models';
const { User } = model;
const JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;


module.exports = function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: 'nodeauthsecret',
    };
    passport.use('jwt', new JwtStrategy(opts, function (jwt_payload, done) {
        User
            .findByPk(jwt_payload.id)
            .then((user) => { return done(null, user); })
            .catch((error) => { return done(error, false); });
    }));
};