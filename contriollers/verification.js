import User from "../model/user.js";
import VerificationCode from "../model/verificationCode.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";
import dotenv from 'dotenv';

dotenv.config();

export const verifyNewUser = async(req, res, next) => {
    try{
        const {verificationCode} = req.body;
   
       const userVerificationCode =  await VerificationCode.findOne(
        {where: {code: verificationCode}}
    );
        if(!userVerificationCode){
           
           return next(new AppError('you was not get verification code try requeting verification code or expire', 401))
           
           
           
        }

         if(Date.now() > userVerificationCode.expiryTime){
            await userVerificationCode.destroy({where: {code: verificationCode}});
            return next(new AppError('sorry your verification code was expire try requesting new one'));
        }
       const user = await User.findOne({
            where: {email: userVerificationCode.userEmail}
        })

        user.isVerify = true;
        await user.save();
        await VerificationCode.destroy({where: {code: verificationCode}});
          
        const payload = {
            id: user.id,
            firstName: user.firstName,
            surName: user.surName,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender || null,      
            pronoun: user.pronoun || null,
            email: user.email
        }

        const accessToken = generateToken(
            payload, 
            process.env.ACCESS_TOKEN_KEY, 
            process.env.ACCESS_TOKEN_EXPIRE);

        const refreshToken =generateToken(
            payload, 
            process.env.REFRESH_TOKEN_KEY, 
            process.env.REFRESH_TOKEN_EXPIRE);


        return res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            } 
        )
        .status(201).json({
           status:'success', 
           message: 'user successfully created',
           accessToken
        });
   
    }

    catch(error){
        next(new AppError(error.message, 500))
    }
};