import express from 'express';
import { protectRoutes } from '../contriollers/auths.js';
import { getLikes, toggleLike } from '../contriollers/like.js';

const router = express.Router();
/**
 * @swagger
 * /like/{postId}:
 *   post:
 *     summary: Toggle like/unlike for a post
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to like/unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post unliked
 *                 liked:
 *                   type: boolean
 *                   example: false
 *                 userId:
 *                   type: integer
 *                 likesCount:
 *                   type: integer
 *       201:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post liked
 *                 liked:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: integer
 *                 likesCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/like/:postId', protectRoutes, toggleLike);


/**
 * @swagger
 * /likes/{postId}:
 *   get:
 *     summary: Get all likes for a post
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of likes for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       fullName:
 *                         type: string
 *                       profileImage:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/like/:postId', protectRoutes, getLikes);


export default router;