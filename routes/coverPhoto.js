import express from 'express';
import { createCoverPhoto, deleteCoverPhoto, editeCoverPhoto, getCoverPhoto } from '../controllers/coverPhotos.js';
import { protectRoutes } from '../controllers/auths.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CoverPhoto
 *   description: User cover photo management
 */
/**
 * @swagger
 * /cover-photo:
 *   post:
 *     summary: Create user cover photo
 *     tags: [CoverPhoto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cover-photo
 *             properties:
 *               cover-photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cover photo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: Cover photo already exists or no file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post('/cover-photo', protectRoutes, upload.single('cover-photo'), createCoverPhoto);


/**
 * @swagger
 * /cover-photo:
 *   get:
 *     summary: Get current user cover photo
 *     tags: [CoverPhoto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cover photo fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: User has no cover photo
 *       401:
 *         description: Unauthorized
 */
router.get('/cover-photo', protectRoutes, getCoverPhoto);

/**
 * @swagger
 * /cover-photo:
 *   patch:
 *     summary: Update user cover photo
 *     tags: [CoverPhoto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cover-photo
 *             properties:
 *               cover-photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: No cover photo available or no file uploaded
 *       401:
 *         description: Unauthorized
 */
router.patch('/cover-photo', protectRoutes, upload.single('cover-photo'), editeCoverPhoto);

/**
 * @swagger
 * /cover-photo:
 *   delete:
 *     summary: Delete user cover photo
 *     tags: [CoverPhoto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cover photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: No cover photo to delete
 *       401:
 *         description: Unauthorized
 */
router.delete('/cover-photo', protectRoutes, deleteCoverPhoto);

export default router;