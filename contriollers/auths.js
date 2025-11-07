import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import emailTransforter from "../config/email.js";
import User from "../model/user.js";
import VerificationCode from "../model/verificationCode.js";
import AppError from "../utils/AppError.js"
import generateToken from "../utils/generateToken.js";
import { generateExpiryTime, generateVerificationCode } from "../utils/codeAndExpire.js";

dotenv.config();

export const registerUser = async(req, res, next) => {
    try{
        const {firstName, surName, dateOfBirth, gender, pronoun, email, password} = req.body;
        
        const existingUser = await User.findOne({where: {email}});

        if(existingUser){
            return next(new AppError('sorry this email is in use try different email', 400));
        }

        
        const hashPassword = await bcrypt.hash(password, 12);

        await User.create({
            firstName, surName, dateOfBirth, gender, pronoun, email, password: hashPassword
        })
      
        const verificationCode = generateVerificationCode();
        const expiryTime = generateExpiryTime();
        
       const saveCode = await VerificationCode.create({
            code: verificationCode,
            expiryTime: expiryTime, 
            userEmail: email
        });
        

       try{ // i use try in case if user not connect to internet instead of crashing the system
             await emailTransforter.sendMail({
            from: process.env.APP_NAME || 'Hassan special facebook clone',
            to: `${email}`,
            subject: 'verification code',
            html: 
                `   
                    <h1>One more step to verify you password</h1>
                    <h2>hi ${firstName}</h2>
                    <p>We got your request to complete your registration. Enter this code in Facebook:</p>
                    <button 
                        style="padding: 15px 350px; color: blue; font-size: 20px">
                            ${verificationCode}
                    </button>
                    <h3>Don't share this code with anyone.</h3>
                    <h3>If someone asks for this code</h3>
                    <p>Don't share this code with anyone, especially if they tell you they work for Facebook or Meta. They may be trying to hack your account.</p>
                    <h2>Thanks,</h2>
                    <h2>Facebook Security</h2>
                
                `
        });

        res.status(200).json({
            status: 'success',
            message: `welcome ${firstName} check your email we'he sended you verification code`
        });

       }
       catch(err){
        next(new AppError(err.message, 400))
       }

    }
    catch  (error){
        next(new AppError(error.message, 500));
    };
};
 

export const requestNewVerificationCode = async(req, res, next) => {
    try{
        const {email} = req.body;
        const existingUser = await User.findOne({where: {email}});  
        if(!existingUser){
            return next(new AppError('email is already registed, try different email', 400));
        }
        if(existingUser.isVerify){
            return next(new AppError('this account is already verify, no need to request new code', 400))
        }

        await VerificationCode.destroy({where: {userEmail: email}});

        const verificationCode = generateVerificationCode();
        const expiryTime = generateExpiryTime();

      await VerificationCode.create({
            code: verificationCode,
            expiryTime: expiryTime, 
            userEmail: email
        });
       
        const user = await User.findOne({where: {email}})

       try{ // i use try in case if user not connect to internet instead of crashing the system
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
            message: `welcome ${user.firstName} check your email we'he sended you verification code`
        });

       }
       catch(err){
        next(new AppError(err.message, 400))
       }

    }
    catch(err){
        next(new AppError(err.message, 500));
    };
};

export const loggingUser = async(req, res, next) => {
    try{
        const {email, password} = req.body;
        const existingUser = await User.findOne({where: {email}});

        if(!existingUser){
            return next(new AppError('user is not found create new account', 400));
        }
        const isCorrectPassword = await bcrypt.compare(password, existingUser.password);

        if(!isCorrectPassword){
            return next(new AppError('incorect password try again', 401));
        }

        if(existingUser.isVerify === false){
            return next(new AppError('not verify use either email or phone number for verification', 401));
        }
        const payload = {
            id: existingUser.id,
            firstName: existingUser.firstName,
            surName: existingUser.surName,
            dateOfBirth: existingUser.dateOfBirth,
            gender: existingUser.gender,
            pronoun: existingUser.pronoun || '',
            email: existingUser.email
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

        res.status(200).json({
            status: 'success',
            message: `welcome back ${existingUser.firstName}`,
            accessToken,
            refreshToken
        })
        
    }
    catch(error){
        next(new AppError(error.message, 500));
    }
}

export const protectRoutes = async(req, res, next) => {
    try{
        const authHeaders = req.headers.authorization;
        if(!authHeaders || !authHeaders.startsWith('Bearer ')){
            return next(new AppError('not logging or ivalid token'));
        }

        const token = authHeaders.split(' ')[1];

        try{
         const decode =  jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
            req.user = decode
            next();
        }
        catch(err){
            next(new AppError(`invalid or expire token ${err.message}`, 401));
        }
    }
    catch(error){
        next(new AppError(error.message, 500));
    };
};

export const requestNewAccessToken = async(req, res, next) => {
    try{
        const {refreshToken} = req.body;
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decode) => {
            if(err){
                return next(new AppError('invalid or expire refresh token', 401));
            }

            const payload = {
                id: decode.id,
                firstName: decode.firstName,
                surName: decode.surName,
                dateOfBirth: decode.dateOfBirth,
                gender: decode.gender,
                pronoun: decode.pronoun || '',
                email: decode.email
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
    catch(error){
        next(new AppError(error.message, 500));
    };
};
 