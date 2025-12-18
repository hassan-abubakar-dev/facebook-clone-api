import express from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedback.js';
import { protectRoutes, restrictTo } from '../controllers/auths.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: User feedback management
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Create feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: This app is amazing, keep improving it
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 feedback:
 *                   type: object
 *       400:
 *         description: Feedback message is required
 *       401:
 *         description: Unauthorized
 */
router.post('/feedback', protectRoutes, createFeedback);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedback (Admin only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       message:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       User:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           surName:
 *                             type: string
 *                           coverPhoto:
 *                             type: object
 *                             properties:
 *                               image:
 *                                 type: string
 *                           profile:
 *                             type: object
 *                             properties:
 *                               image:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/feedback', protectRoutes, restrictTo('admin'), getAllFeedback) 

export default router;