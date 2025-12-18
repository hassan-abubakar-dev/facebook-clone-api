import joi from "joi";

export const registerUserSchema = joi.object({
    firstName:
        joi.string().min(3).max(35).required()
            .messages({
                'string.base':'first name must be text',
                'string.empty':'first name must not be empty',
                'string.min':'first name must be atleast 3 character length',
                'string.max':'first name must be lessthan 35 or 35 character length',
                'any.require': 'name must be provided'
            }),

    surName: 
            joi.string().min(3).max(35).required()
            .messages({
                'string.base':'surName must be text',
                'string.empty':'surName must not be empty',
                'string.min':'surName must be atleast 3 character length',
                'string.max':'surName must be lessthan 35 or 35 character length',
                'anyrequire': 'surName must be provided'
            }),
       
   
    dateOfBirth: joi.string().max(35).required()
        .messages({
           
            'string.empty': 'Date of birth must not be empty',
            'string.max': 'Date of birth must be less than or equal to 35 characters',
            'any.required': 'Date of birth must be provided'
        }),

     gender: 
            joi.string().optional().allow(null, '')
            .messages({
               'string.base':'gender must be text',
            }),  

    pronoun: 
            joi.string().optional().allow(null, '')   
            .messages({
                'string.base':'pronoun must be text',
            }),
 
    
    email: 
            joi.string().min(10).max(45).email().required()
            .messages({
                'string.base':'email must be text',
                'string.empty':'email must not be empty',
                'string.min':'email must be atleast 10 character length',
                'string.max':'email must be lessthan 45 or 45 character length',
                'string.email':'email must be valid email',
                'any.require': 'email must be provided'
            }),

    
    password: 
            joi.string().min(6).max(35).required()
            .messages({
                'string.base':'password must be text',
                'string.empty':'password must not be empty',
                'string.min':'password must be atleast 6 character length',
                'string.max':'password must be lessthan 35 or 35 character length',
                'any.require': 'password must be provided'
            }),
});

export const verifySchema = joi.object({
    verificationCode:
        joi.string().min(6).max(6).required()
            .messages({
                'string.empty': 'verificationCode must be provided',
                'string.base':'verificationCode must be string',
                'string.min': 'verificationCode must be 6 character',
                'string.max': 'verificationCode must be 6 character'
            })
});

export const loggingUserSchema = joi.object({

     email: 
            joi.string().min(10).max(45).email().required()
            .messages({
                'string.base':'email must be text',
                'string.empty':'email must not be empty',
                'string.min':'email must be atleast 10 character length',
                'string.max':'email must be lessthan 45 or 45 character length',
                'string.email':'email must be valid email',
                'string.require': 'email must be provided'
            }),

    
    password: 
            joi.string().min(6).max(35).required()
            .messages({
                'string.base':'password must be text',
                'string.empty':'password must not be empty',
                'string.min':'password must be atleast 6 character length',
                'string.max':'password must be lessthan 35 or 35 character length',
                'string.require': 'password must be provided'
            }),

});

export const changePasswordSchema = joi.object({
     password: 
            joi.string().min(6).max(35).required()
            .messages({
                'string.base':'password must be text',
                'string.empty':'password must not be empty',
                'string.min':'password must be atleast 6 character length',
                'string.max':'password must be lessthan 35 or 35 character length',
                'string.require': 'password must be provided'
            }),
        comfirmPassword: 
             joi.string().min(6).max(35).required()
            .messages({
                'string.base':'password must be text',
                'string.empty':'password must not be empty',
                'string.min':'password must be atleast 6 character length',
                'string.max':'password must be lessthan 35 or 35 character length',
                'string.require': 'password must be provided'
            }),

        changePasswordToken: 
            joi.string().required()
            .messages({
                'string.empty':'changePasswordToken must not be empty',
                'string.require': 'changePasswordToken must be provided'
            })
});

export const verifyEmail = joi.object({
   
    email: 
            joi.string().min(10).max(45).email().required()
            .messages({
                'string.base':'email must be text',
                'string.empty':'email must not be empty',
                'string.min':'email must be atleast 10 character length',
                'string.max':'email must be lessthan 45 or 45 character length',
                'string.email':'email must be valid email',
                'string.require': 'email must be provided'
            })
});