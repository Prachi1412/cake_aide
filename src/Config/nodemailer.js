import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import responses from '../Modules/responses';
import UserModel from '../Modals/user_model';
import config from '../Config/development'
import twilio from 'twilio';

exports.sendMail = function (verification_code , email_id)  {

    let config = {
        "SMTP_HOST": "smtp.sendgrid.net",
        "SMTP_PORT": 25,
        "SMTP_USER": "apikey",
        "SMTP_PASS": "config.SMTP_PASS"

    }

    let mailer = nodemailer.createTransport(smtpTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS
        }
    }));
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

