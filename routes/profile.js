import express from 'express';
import { protectRoutes } from '../controllers/auths.js';
import upload from '../middleware/upload.js';
import {createProfile, getProfileImage} from '../controllers/profile.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Manage user profile images
 */

/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Upload or update profile image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile-image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file to upload
 *     responses:
 *       201:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: profile image uploaded successfully
 *                 image:
 *                   type: string
 *       400:
 *         description: File not uploaded or invalid
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch('/profile', protectRoutes, upload.single('profile-image'), createProfile)

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user's profile image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: profile fetched successfully
 *                 image:
 *                   type: string
 *       400:
 *         description: No profile exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile', protectRoutes, getProfileImage)

export default router;