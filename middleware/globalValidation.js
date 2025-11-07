import AppError from "../utils/AppError.js";

const validate = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body, {
            abortEarly: false
        });

        if(error){
            const message = error.details.map(err => err.message);
            return next( new AppError(message, 400));
        }
        else{
            next();
        }
    }
}

export default validate;
