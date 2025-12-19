import cloudinary from "../config/cloudinary.js";
import Friendship from "../model/frienship.js";
import Like from "../model/like.js";
import Post from "../model/post.js";
import User from "../model/user.js";
import AppError from "../utils/AppError.js";
import Comment from "../model/comment.js";
import fs from "fs";
import Profile from "../model/profile.js";
import CoverPhoto from "../model/coverPhoto.js";

export const createPost = async (req, res, next) => {
  try {
    const { content, postColor, requestId } = req.body;
    
    const userId = req.user.id;

    let uploaded = null;

    if (req.file) {
      cloudinary.uploader.upload_stream(
        { folder: "post-images" },
        async (error, result) => {
          if (error) {
            return next(new AppError("image upload failed", 500));
          }

          uploaded = result;

          const post = await Post.create({
            content,
            postColor,
            image: uploaded.secure_url,
            publicId: uploaded.public_id,
            userId,
            requestId
          });

          return res.status(201).json({
            status: "success",
            post,
          });
        }
      ).end(req.file.buffer);

    } else {
      const post = await Post.create({
        content,
        postColor,
        image: null,
        publicId: null,
        userId,
        requestId
      });

      return res.status(201).json({
        status: "success",
        post,
      });
    }

  } catch (err) {
    console.err(err)
    next(new AppError(err.message, 500));
  }
};



export const getAllFriendPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Get all friendships with accepted status
    const friendships = await Friendship.findAll({
      where: { status: "accepted" }
    });

    // 2. Extract friend IDs from both sender/receiver
    const friendIds = [];

    friendships.forEach(f => {
      if (f.senderId === userId) friendIds.push(f.receiverId);
      if (f.receiverId === userId) friendIds.push(f.senderId);
    });

    // Add the user also (so he sees his own posts)
    friendIds.push(userId);

    // 3. Fetch posts from user + friends
    const posts = await Post.findAll({
      where: { userId: friendIds },
      order: [["createdAt", "DESC"]],
      include: [
           
            {
              model: User,
              attributes: ["id", "firstName", 'surName'],
              include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['image']
                },
                {
                    model: CoverPhoto,
                    as: 'coverPhoto',
                    attributes: ['image']
                },{
                  model: Post
                }
              ]
            },
    
        {
          model: Comment,
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: User,
              attributes: ["id", "firstName", 'surName'],
              include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['image']
                },
                {
                    model: CoverPhoto,
                    as: 'coverPhoto',
                    attributes: ['image']
                }
              ]
            }
          ]
        },
        {
          model: Like,
          attributes: ["id", "userId"],
           include: [
            {
              model: User,
              attributes: ["id", "firstName", 'surName'],
               include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['image']
                },
                {
                    model: CoverPhoto,
                    as: 'coverPhoto',
                    attributes: ['image']
                }
              ]
            }
          ], order: [["createdAt", "DESC"]]
        }
      ]
    });

    // Add likeCount for frontend
    const finalPosts = posts.map(post => ({
      ...post.toJSON(),
      likeCount: post.Likes.length
    }));

    res.status(200).json({
      status: "success",
      posts: finalPosts
    });

  } catch (err) {
    console.err(err);
   next(new AppError(err.message, 500));
  }
};

