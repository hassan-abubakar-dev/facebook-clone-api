import express from 'express';
import { getUsers, getCurrentUser } from '../contriollers/user.js';
import { protectRoutes } from '../contriollers/auths.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manage users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users excluding current user's friends and self, with optional search
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page (default 10)
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for firstName or surName
 *     responses:
 *       200:
 *         description: Users fetched successfully
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
 *                   example: users fetched successfully
 *                 count:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       firstName:
 *                         type: string
 *                       surName:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       pronoun:
 *                         type: string
 *                       profile:
 *                         type: object
 *                         properties:
 *                           image:
 *                             type: string
 *                       coverPhoto:
 *                         type: object
 *                         properties:
 *                           image:
 *                             type: string
 *                       Posts:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/users', protectRoutes, getUsers);

/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: Get current logged-in user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info fetched successfully
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
 *                   example: you have successfully get your information
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     surName:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                     pronoun:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profile:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                     coverPhoto:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                     Posts:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: User not verified
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/users/user', protectRoutes, getCurrentUser);

export default router;