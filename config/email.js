import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const emailTransforter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS_USER,
        pass: process.env.EMAIL_ADDRESS_PASSWORD
    }
});

export default emailTransforter;