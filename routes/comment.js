import express from 'express';
import { protectRoutes } from '../contriollers/auths.js';
import { createComment } from '../contriollers/comment.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment management
 */

/**
 * @swagger
 * /api/create-comment/{postId}:
 *   post:
 *     summary: Create a comment on a post
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Comment created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post('/create-comment/:postId', protectRoutes, createComment);


export default router;