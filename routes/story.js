import express from 'express';
import { protectRoutes } from '../contriollers/auths.js';
import upload from '../middleware/upload.js';
import { createStory, getAllFriendStories } from '../contriollers/story.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Story
 *   description: Manage user stories (text & image)
 */

/**
 * @swagger
 * /create-story:
 *   post:
 *     summary: Create a new story (text or image)
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Optional text content for the story
 *                 example: My new story text
 *               story-image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the story
 *               requestId:
 *                 type: string
 *                 description: Optional unique request ID to prevent duplicates
 *     responses:
 *       201:
 *         description: Story created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Story created successfully
 *                 storyType:
 *                   type: string
 *                   example: image
 *                 story:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     image:
 *                       type: string
 *                     requestId:
 *                       type: string
 *                     userId:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Story must contain either text or image / duplicate story
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/create-story', protectRoutes, upload.single("story-image"), createStory);

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get all stories from user and friends
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stories fetched successfully
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
 *                   example: story has been fetched successfully
 *                 stories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       text:
 *                         type: string
 *                       image:
 *                         type: string
 *                       userId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       User:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           firstName:
 *                             type: string
 *                           surName:
 *                             type: string
 *                           profile:
 *                             type: object
 *                             properties:
 *                               image:
 *                                 type: string
 *                           coverPhoto:
 *                             type: object
 *                             properties:
 *                               image:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/stories', protectRoutes, getAllFriendStories);

export default router;