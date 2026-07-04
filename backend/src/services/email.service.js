import nodemailer from 'nodemailer';
import config from '../config/config.js';

const hasEmailConfig = Boolean(
    config.GOOGLE_USER &&
    config.GOOGLE_CLIENT_ID &&
    config.GOOGLE_CLIENT_SECRET &&
    config.GOOGLE_REFRESH_TOKEN
);

const transporter = hasEmailConfig
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: config.GOOGLE_USER,
            clientId: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            refreshToken: config.GOOGLE_REFRESH_TOKEN,
        }
    })
    : null;

if (transporter) {
    transporter.verify((error) => {
        if (error) {
            console.error('Error connecting to email server:', error);
        } else {
            console.log('Email server is ready to take messages');
        }
    });
} else {
    console.warn('Email service is not configured. Set Gmail OAuth credentials to enable email sending.');
}

export async function sendEmail(to, subject, html) {
    if (!transporter) {
        throw new Error('Email service is not configured');
    }

    const mailOptions = {
        from: config.GOOGLE_USER,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error('Error sending email');
    }
}