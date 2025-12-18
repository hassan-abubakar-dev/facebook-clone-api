import express from 'express';
import { addFriend, cancelFriendRequest, deleteFriend, deleteFriendRequest, getAllfriends, getFriendRequest, receiveFriend } from '../controllers/friendship.js';
import { protectRoutes } from '../controllers/auths.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friendship
 *   description: Manage friend requests and friends
 */

/**
 * @swagger
 * /frienship/{receiverId}:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to send a friend request to
 *     responses:
 *       200:
 *         description: Friend request sent successfully
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
 *         description: Errors such as sending to self or request already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/frienship/:receiverId', protectRoutes, addFriend);

/**
 * @swagger
 * /friendship/{senderId}:
 *   patch:
 *     summary: Accept a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user who sent the friend request
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: No friend request from this user
 *       401:
 *         description: Unauthorized
 */
router.patch('/friendship/:senderId', protectRoutes, receiveFriend);

/**
 * @swagger
 * /friendship/{receiverId}:
 *   delete:
 *     summary: Cancel a sent friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to cancel the request for
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 *       400:
 *         description: Cannot cancel request not sent
 *       401:
 *         description: Unauthorized
 */
router.delete('/friendship/:receiverId', protectRoutes, cancelFriendRequest);

/**
 * @swagger
 * /friendrequest/{senderId}:
 *   delete:
 *     summary: Delete a received friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user who sent the request
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       400:
 *         description: Cannot delete request that doesn't exist
 *       401:
 *         description: Unauthorized
 */
router.delete('/friendrequest/:senderId', protectRoutes, deleteFriendRequest);

/**
 * @swagger
 * /friendship/request:
 *   get:
 *     summary: Get all incoming friend requests
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of incoming friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 friendRequests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sender:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           firstName:
 *                             type: string
 *                           surName:
 *                             type: string
 *                           gender:
 *                             type: string
 *                           pronoun:
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
 *                           Post:
 *                             type: array
 *                 count:
 *                   type: integer
 *                 totalFriendRequest:
 *                   type: integer
 *       400:
 *         description: No friend requests
 *       401:
 *         description: Unauthorized
 */
router.get('/friendship/request', protectRoutes, getFriendRequest);

/**
 * @swagger
 * /friendship/friends:
 *   get:
 *     summary: Get all friends of the current user
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for friend
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sender:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           firstName:
 *                             type: string
 *                           surName:
 *                             type: string
 *                           gender:
 *                             type: string
 *                           pronoun:
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
 *                           Post:
 *                             type: array
 *                 count:
 *                   type: integer
 *                 totalFriends:
 *                   type: integer
 *       400:
 *         description: No friends found
 *       401:
 *         description: Unauthorized
 */
router.get('/friendship/friends', protectRoutes, getAllfriends);

/**
 * @swagger
 * /friendship{senderId}:
 *   delete:
 *     summary: Delete a friend
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the friend to delete
 *     responses:
 *       200:
 *         description: Friend deleted successfully
 *       400:
 *         description: Friend does not exist
 *       401:
 *         description: Unauthorized
 */
router.delete('/friendship:senderId', protectRoutes, deleteFriend);


export default router;