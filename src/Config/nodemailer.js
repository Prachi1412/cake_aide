import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import responses from '../Modules/responses';
import UserModel from '../Modals/user_model';
import config from './development.json';

exports.sendMail = function (verification_code , email_id)  {
    let values = {
        host: config.mailCredential.host,
        port: config.mailCredential.port,
        auth: {
            user: config.mailCredential.auth.user,
            pass: config.mailCredential.auth.pass
        }
    };
    console.log(values);

    let mailer = nodemailer.createTransport( smtpTransport(values) );
    mailer.sendMail({
        from: "Team@cake.in",
        to: email_id,
        cc: "",
        subject: "Welcome to cake aide",
        template: "",
        html: " Your One Time Password is :" + verification_code
    }, (error, response) => {
        if (error) { // resolve({ message: "Email not send " });\
            console.log(error);
        } else {
            console.log(response)
            // resolve({ message: "Email send successfully" });\
        }
        mailer.close();
    });
}



