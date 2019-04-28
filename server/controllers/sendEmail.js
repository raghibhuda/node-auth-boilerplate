import nodemailer from 'nodemailer';
require('dotenv').config();
class EmailSender {
    
    static sendSampleMail(req, res) {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_DRIVER,
            port: process.env.MAIL_DRIVER_PORT,
            auth: {
                user: process.env.MAIL_DRIVER_USER,
                pass: process.env.MAIL_DRIVER_PASSWORD
            }
        });
        const mailOptions = {
            from: '"Ragib test server " <test@example.com>',
            to: req.body.email,
            subject: "Test email is it working !",
            text: " Love is in the server :p "
        };
        return transporter
            .sendMail(mailOptions)
            .then(response => res.status(201).send({
                success: true,
                message: 'Email sent successfully',
                response
            }))

    }

    static verificationEmail(receiver, token) {

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_DRIVER,
            port: process.env.MAIL_DRIVER_PORT,
            // secure: false,
            auth: {
                user: process.env.MAIL_DRIVER_USER,
                pass: process.env.MAIL_DRIVER_PASSWORD
            }
        });
        let hostUrl = process.env.APP_HOST_URL;
        const mailOptions = {
            from: '"Ragib test server " <test@example.com>',
            to: receiver,
            subject: "Test email is it working !",
            text: `Click on this link to verify your email ${hostUrl}/resetpass?token=${token}&email=${receiver}`
        };
        return transporter
            .sendMail(mailOptions)
            .then(response => res.status(201).send({
                success: true,
                message: 'Verification Email sent successfully',
                response
            })).catch((error) => res.status(401).send(error));

    }


}

export default EmailSender.verificationEmail;