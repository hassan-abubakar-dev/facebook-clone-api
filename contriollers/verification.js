import User from "../model/user.js";
import VerificationCode from "../model/verificationCode.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";
import dotenv from 'dotenv';
import Profile from "../model/profile.js";

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

        let avater = '';
        const gender = (user.gender).toLowerCase();
        if(gender === 'male'){
            avater = process.env.AVATER_MALE_PROFILE;
        }
        else if(gender === 'female'){
            avater = process.env.AVATER_FEMALE_PROFILE;
        }
        else{
            avater = process.env.AVATER_NEUTRAL_PROFILE;
        }

        const profile = await Profile.create(
            {
                image: avater,
                userId: user.id
            }
        );
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
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            } 
        )
        .status(201).json({
           status:'success', 
           message: 'user successfully created',
           accessToken,
           profile
        });
   
    }

    catch(error){
        next(new AppError(error.message, 500))
    }
};


export const verifyChangePasswordCode = async(req, res, next) => {
    try{
        const {verificationCode} = req.body;
   
       const userVerificationCode =  await VerificationCode.findOne(
        {where: {code: verificationCode}}
    );
        if(!userVerificationCode){
           
           return next(new AppError('you was not get verification code try requeting verification code or it expire', 401))
           
          
        }

         if(Date.now() > userVerificationCode.expiryTime){
            await userVerificationCode.destroy({where: {code: verificationCode}});
            return next(new AppError('sorry your verification code was expire try requesting new one'));
        };

        const user = await User.findOne({where: {email: userVerificationCode.userEmail}});
        const userId = user.id

        const changePasswordToken = generateToken(
            {id: userId}, 
            process.env.CHANGE_PASSWORD_TOKEN_KEY,
            process.env.CHANGE_PASSWORD_TOKEN_EXPIRE
        )
      
        res.status(200).json({
            status: 'success',
            message: 'varification success',
            changePasswordToken
        });
   
    }

    catch(error){
        next(new AppError(error.message, 500))
    }
};

