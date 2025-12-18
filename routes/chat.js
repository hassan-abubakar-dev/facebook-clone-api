import express from 'express';
import { getChats, getRoomId } from '../contriollers/chat.js';
import { protectRoutes } from '../contriollers/auths.js';

const router = express.Router();

/**
 * @swagger
 * /api/chat/roomId:
 *   post:
 *     summary: Get or create chat room ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Room ID returned successfully
 *       401:
 *         description: Unauthorized
 */

router.post('/roomId', protectRoutes,  getRoomId);

/**
 * @swagger
 * /api/chat/chats:
 *   post:
 *     summary: Get messages in a chat room
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *             properties:
 *               roomId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Chat messages retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.post('/chats', protectRoutes, getChats);

export default router; 