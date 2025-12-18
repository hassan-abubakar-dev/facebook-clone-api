import express from 'express';
import { changePassword, loggingUser, logOutUser, registerUser, requestChangePassword, requestNewAccessToken, requestNewVerificationCode } from '../contriollers/auths.js';
import { verifyChangePasswordCode, verifyNewUser } from '../contriollers/verifiCation.js';
import validate from '../middleware/globalValidation.js';
import { changePasswordSchema, loggingUserSchema, registerUserSchema, verifyEmail, verifySchema } from '../validations/auths.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: auths
 *   description: authentication routes
 */

/**
 * @swagger
 * /api/auths/register:
 *   post:
 *     summary: Register a new user
 *     tags: [auths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - surName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               surName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/register', validate(registerUserSchema), registerUser);

/**
 * @swagger
 * /api/auths/verify:
 *   post:
 *     summary: Verify newly registered user
 *     tags: [auths]
 *     responses:
 *       200:
 *         description: Verification succeeded
 */
router.post('/verify', validate(verifySchema), verifyNewUser);

/**
 * @swagger
 * /api/auths/login:
 *   post:
 *     summary: Login a user
 *     tags: [auths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/logging', validate(loggingUserSchema), loggingUser);

/**
 * @swagger
 * /api/auths/refresh:
 *   post:
 *     summary: Request new access token using refresh token
 *     tags: [auths]
 *     responses:
 *       201:
 *         description: Access token refreshed successfully
 */
router.post('/refresh', requestNewAccessToken);

/**
 * @swagger
 * /api/auths/request-new-code:
 *   post:
 *     summary: Request new verification code
 *     tags: [auths]
 *     responses:
 *       201:
 *         description: New verification code sent to email
 */
router.post('/request-new-code', requestNewVerificationCode);

/**
 * @swagger
 * /api/auths/logout:
 *   post:
 *     summary: Logout user and clear refresh token
 *     tags: [auths]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', logOutUser);

/**
 * @swagger
 * /api/auths/verify/email-check:
 *   post:
 *     summary: Check if email exists before password reset
 *     tags: [auths]
 *     responses:
 *       201:
 *         description: Email verified
 */
router.post('/verify/email-check', validate(verifyEmail), requestChangePassword);

/**
 * @swagger
 * /api/auths/verify/code-check:
 *   post:
 *     summary: Verify password reset code
 *     tags: [auths]
 *     responses:
 *       200:
 *         description: Code verified successfully
 */
router.post('/verify/code-check', validate(verifySchema), verifyChangePasswordCode);

/**
 * @swagger
 * /api/auths/verify/change-password:
 *   post:
 *     summary: Change password after verification
 *     tags: [auths]
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/verify/change-password', validate(changePasswordSchema), changePassword);

export default router;
