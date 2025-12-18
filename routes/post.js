import express from 'express';
import { protectRoutes } from '../contriollers/auths.js';
import upload from '../middleware/upload.js';
import { createPost, getAllFriendPosts } from '../contriollers/post.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Manage user posts
 */

/**
 * @swagger
 * /create-post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello, this is my new post!
 *               postColor:
 *                 type: string
 *                 example: "#ffffff"
 *               post-image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image for the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     postColor:
 *                       type: string
 *                     image:
 *                       type: string
 *                     publicId:
 *                       type: string
 *                     userId:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Server error
 *       401:
 *         description: Unauthorized
 */
router.post('/create-post', protectRoutes, upload.single('post-image'), createPost);

/**
 * @swagger
 * /friend-posts:
 *   get:
 *     summary: Get posts from friends and the current user
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       postColor:
 *                         type: string
 *                       image:
 *                         type: string
 *                       publicId:
 *                         type: string
 *                       userId:
 *                         type: integer
 *                       likeCount:
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
 *                       Likes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             userId:
 *                               type: integer
 *                             User:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 firstName:
 *                                   type: string
 *                                 surName:
 *                                   type: string
 *                                 profile:
 *                                   type: object
 *                                   properties:
 *                                     image:
 *                                       type: string
 *                                 coverPhoto:
 *                                   type: object
 *                                   properties:
 *                                     image:
 *                                       type: string
 *                       Comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             content:
 *                               type: string
 *                             userId:
 *                               type: integer
 *                             User:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 firstName:
 *                                   type: string
 *                                 surName:
 *                                   type: string
 *                                 profile:
 *                                   type: object
 *                                   properties:
 *                                     image:
 *                                       type: string
 *                                 coverPhoto:
 *                                   type: object
 *                                   properties:
 *                                     image:
 *                                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/friend-posts', protectRoutes, getAllFriendPosts);

export default router;