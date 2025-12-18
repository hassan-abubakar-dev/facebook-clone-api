import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import emailTransforter from "../config/email.js";
import User from "../model/user.js";
import VerificationCode from "../model/verificationCode.js";
import AppError from "../utils/AppError.js"
import generateToken from "../utils/generateToken.js";
import { generateExpiryTime, generateVerificationCode } from "../utils/codeAndExpire.js";
import Profile from "../model/profile.js";

dotenv.config();

import { dbConnection } from "../config/db.js";

export const registerUser = async (req, res, next) => {
    const t = await dbConnection.transaction(); // start transaction
    try {
        const { firstName, surName, dateOfBirth, gender, pronoun, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email }, transaction: t });
        if (existingUser) {
            await t.rollback();
            return next(new AppError('Sorry, this email is in use. Try a different email', 400));
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            firstName,
            surName,
            dateOfBirth,
            gender,
            pronoun,
            email,
            password: hashPassword
        }, { transaction: t });

        const verificationCode = generateVerificationCode();
        const expiryTime = generateExpiryTime();

        await VerificationCode.create({
            code: verificationCode,
            expiryTime,
            userEmail: email
        }, { transaction: t });

        // Try sending email, if fails it will rollback
        try {
            await emailTransforter.sendMail({
                from: `"${process.env.APP_NAME || 'Hassan App'}" <hassanabubakarmaiwada7@gmail.com>`,
                to: email,
                subject: 'Account Verification Code',
                html: `
    <h1>Verify your account</h1>

    <h2>Hi ${firstName},</h2>

    <p>Thank you for registering.</p>
    <p>Please enter the verification code below to complete your registration:</p>

    <div style="margin: 20px 0;">
      <span style="
        display: inline-block;
        padding: 12px 24px;
        border: 1px solid #198754;
        font-size: 20px;
        font-weight: bold;
        color: #198754;
        letter-spacing: 2px;
      ">
        ${verificationCode}
      </span>
    </div>

    <p><strong>Do not share this code with anyone.</strong></p>
    <p>If someone asks for this code, they may be trying to access your account.</p>

    <p>Thanks,<br/>${process.env.APP_NAME || 'Hassan App'} Security Team</p>

    <p>
      For more information, visit
      <a href="https://personal-portfolio-tau-jade.vercel.app/">
        our support page
      </a>
    </p>
  `
            });


            await t.commit(); // commit only after email sent

            res.status(200).json({
                status: 'success',
                message: `Welcome ${firstName}, check your email. We've sent you a verification code.`
            });

        } catch (emailErr) {
            await t.rollback(); // rollback if email fails
            console.error(emailErr);
            return next(new AppError('Failed to send verification email. Please try again.', 400));
        }

    } catch (error) {
        await t.rollback();
        console.error(error);
        next(new AppError('Registration failed. Please try again.', 500));
    }
};



export const requestNewVerificationCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return next(new AppError('email is already registed, try different email', 400));
        }
        // if(existingUser.isVerify){
        //     return next(new AppError('this account is already verify, no need to request new code', 400))
        // } it has to be like this but i need to share this function to requet new code for change password

        await VerificationCode.destroy({ where: { userEmail: email } });

        const verificationCode = generateVerificationCode();
        const expiryTime = generateExpiryTime();

        await VerificationCode.create({
            code: verificationCode,
            expiryTime: expiryTime,
            userEmail: email
        });

        const user = await User.findOne({ where: { email } })

        try { // i use try in case if user not connect to internet instead of crashing the system
            await emailTransforter.sendMail({
                from: process.env.APP_NAME || 'Hassan special facebook clone',
                to: `${email}`,
                subject: 'verification code',
                html:
                    `
                    <h2>hi ${user.firstName}</h2>
                    <P>${verificationCode}</p>
                
                `
            });

            res.status(200).json({
                status: 'success',
                message: `welcome ${user.firstName} check your email we've sended you verification code`
            });

        }
        catch (err) {
            console.error(err);
            next(new AppError(err.message, 400))
        }

    }
    catch (err) {
        console.error(err);
        next(new AppError(err.message, 500));
    };
};

export const loggingUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            return next(new AppError('user is not found create new account', 400));
        }
        const isCorrectPassword = await bcrypt.compare(password, existingUser.password);

        if (!isCorrectPassword) {
            return next(new AppError('incorect password try again', 401));
        }

        if (existingUser.isVerify === false) {
            return next(new AppError('not verify use either email or phone number for verification', 401));
        }
        const payload = {
            id: existingUser.id,
            firstName: existingUser.firstName,
            surName: existingUser.surName,
            dateOfBirth: existingUser.dateOfBirth,
            gender: existingUser.gender,
            pronoun: existingUser.pronoun || '',
            email: existingUser.email,
            role: existingUser.role
        }

        const accessToken = generateToken(
            payload,
            process.env.ACCESS_TOKEN_KEY,
            process.env.ACCESS_TOKEN_EXPIRE
        );

        const refreshToken = generateToken(
            payload,
            process.env.REFRESH_TOKEN_KEY,
            process.env.REFRESH_TOKEN_EXPIRE
        );

        const profile = await Profile.findOne({ where: { userId: existingUser.id } });

        res.status(200).cookie('refreshToken', refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )
            .json({
                status: 'success',
                message: `welcome back ${existingUser.firstName}`,
                accessToken,
                profile
            })

    }
    catch (error) {
        console.error(err);
        next(new AppError(error.message, 500));
    }
}

export const logOutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken; //from cookies perser 
        if (!refreshToken) {
            return next(new AppError('no refresh token availble you are already logout', 400));
        }

        res.clearCookie('refreshToken',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        );

        res.status(200).json({
            status: 'success',
            message: 'refreshToken deleted successfully'
        });
    }
    catch (err) {
        console.error(err);
        next(new AppError(err.message, 500));
    };
};

export const protectRoutes = async (req, res, next) => {
    try {

        const authHeaders = req.headers.authorization;
        if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
            return next(new AppError('not logging or ivalid token', 401));
        }

        const token = authHeaders.split(' ')[1].trim();


        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decode) => {
            if (err) {
                return next(new AppError(`invalid or expire token`, 401));
            }
            req.user = decode
            next();
        });





    }
    catch (error) {
        console.error(err);
        next(new AppError(error.message, 500));
    };
};

export const requestNewAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken


        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decode) => {
            if (err) {
                return next(new AppError('invalid or expire refresh token', 401));
            }

            const payload = {
                id: decode.id,
                firstName: decode.firstName,
                surName: decode.surName,
                dateOfBirth: decode.dateOfBirth,
                gender: decode.gender,
                pronoun: decode.pronoun || '',
                email: decode.email,
                role: decode.role
            };
            const newAccessToken = generateToken(
                payload,
                process.env.ACCESS_TOKEN_KEY,
                process.env.ACCESS_TOKEN_EXPIRE
            );

            res.status(201).json({
                status: 'success',
                message: 'new access token was generated successfully',
                accessToken: newAccessToken
            });
        });
    }
    catch (error) {
        console.error(err);
        next(new AppError(error.message, 500));
    };
};

export const requestChangePassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ where: { email } });


        if (!existingUser) {
            return next(new AppError("User with this email does not exist", 404));
        }

        if (!existingUser.isVerify) {
            return next(new AppError('this account is already is not verify', 400))
        }

        const verificationCode = generateVerificationCode();
        const expiryTime = generateExpiryTime();

        await VerificationCode.create({
            code: verificationCode,
            expiryTime: expiryTime,
            userEmail: email
        });

        const user = await User.findOne({ where: { email } })

        try { // i use try in case if user not connect to internet instead of crashing the system
            await emailTransforter.sendMail({
                from: 'hassanabubakarmaiwada7@gmail.com',
                to: `${email}`,
                subject: 'verification code',
                html: `   
                    <h1>One more step to verify your account to change password</h1>
                    <h2>Hi ${user.firstName}</h2>
                    <p>We got your request to change your pasword. Enter this code in the app::</p>
                    <button 
                        style="padding: 15px 350px; color: blue; font-size: 20px">
                           ${verificationCode}
                    </button>
                    <h3>Don't share this code with anyone.</h3>
                    <h3>If someone asks for this code</h3>
                    <p>Don't share this code with anyone, especially if they tell you they work for our Facebook or Meta. They may be trying to hack your account.</p>
                    <h2>Thanks,</h2>
                    <h2>Facebook Security</h2>
                    <h2>For more information contact us <a href="https://personal-portfolio-tau-jade.vercel.app/">
  Visit our support page
</a>
                `

            });

            res.status(200).json({
                status: 'success',
                message: `welcome ${user.firstName} check your email we've sended you verification code`
            });

        }
        catch (err) {
            next(new AppError(err.message, 400))
        }

    }
    catch (err) {
        next(new AppError(err.message, 500));
    };
};

export const changePassword = async (req, res, next) => {
    try {
        const { password, comfirmPassword, changePasswordToken } = req.body;



        jwt.verify(changePasswordToken, process.env.CHANGE_PASSWORD_TOKEN_KEY, async (err, userId) => {
            if (err) {
                return next(new AppError(err.message, 401));
            }

            if (password !== comfirmPassword) {
                return next(new AppError('first and second password mismatch', 400));
            };

            const user = await User.findByPk(userId.id); //no need to check is verify it already check before sending token
            const hashNewPassword = await bcrypt.hash(password, 12);
            user.password = hashNewPassword;
            user.save();

            res.status(201).json({
                status: 'success',
                message: 'new password was generated successfully',
                newPassword: password
            });
        });

    }
    catch (err) {
        console.error(err);
        next(new AppError(err.message, 500));
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('Permission denied', 403));
        }
        next();
    };
};