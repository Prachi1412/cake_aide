import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import responses from '../Modules/responses';
import UserModel from '../Modals/user_model';
import twilio from 'twilio';

exports.sendMail = function (verification_code , email_id)  {

    let mailer = nodemailer.createTransport(smtpTransport({
        "SMTP_HOST": "smtp.sendgrid.net",
        "SMTP_PORT": 25,
        "SMTP_USER": "apikey",
        "SMTP_PASS":"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"
        // host: config.SMTP_HOST,
        // port: config.SMTP_PORT,
        // auth: {
        //     user: config.SMTP_USER,
        //     pass: config.SMTP_PASS
        //}
    }));
    mailer.sendMail({
        from: "Team@cake.in",
        to: email_id,
        cc: "",
        subject: "Welcome to cake aide",
        template: "Hello",
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


