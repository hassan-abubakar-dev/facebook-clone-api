import express from 'express';
import { loggingUser, registerUser, requestNewAccessToken, requestNewVerificationCode } from '../contriollers/auths.js';
import { verifyNewUser } from '../contriollers/verifiCation.js';
import validate from '../middleware/globalValidation.js';
import { loggingUserSchema, registerUserSchema, verifySchema } from '../validations/auths.js';

const router = express.Router();

router.post('/register',  registerUser);
router.post('/verify', validate(verifySchema), verifyNewUser);
router.post('/logging', validate(loggingUserSchema), loggingUser);
router.post('/refresh', requestNewAccessToken);
router.post('/request-new-code', requestNewVerificationCode);  

export default router; 