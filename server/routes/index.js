import Users from '../controllers/user';
// import EmailSender from '../controllers/sendEmail';
import Verifier from '../controllers/mailVeification';
import PasswordReseter from '../controllers/resetPassword';
import cors from 'cors';
import passport from 'passport';
require('../config/passport')(passport);

export default (app) => {

    let corsConfig = {
        origin: 'http://localhost:3000',
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 200
    };

    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the REST API Boilerplate!',
    }));
    
    app.post('/api/sign-up', cors(corsConfig), Users.signUp);
    app.post('/api/sign-in', cors(corsConfig), Users.signIn);

    //Email varification routes
    app.post('/api/send-verification-mail',cors(corsConfig),Verifier.requestVerification);
    app.post('/verification',Verifier.modifiedVerification);
    
    //Forget Password and  reset routes
    app.post('/send-rest-password-mail',PasswordReseter.requestPasswordReset);
    app.post('/reset-password',PasswordReseter.resetPassword);
    
}