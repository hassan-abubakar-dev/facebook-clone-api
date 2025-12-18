import cloudinary from "../config/cloudinary.js";
import CoverPhoto from "../model/coverPhoto.js";
import Friendship from "../model/frienship.js";
import Profile from "../model/profile.js";
import Story from "../model/story.js";
import User from "../model/user.js";
import AppError from "../utils/AppError.js";

export const createStory = async (req, res, next) => {
  try {
    const { text, requestId } = req.body;
    const userId = req.user.id;

    // prevent duplicate story
    if (requestId) {
      const existingStory = await Story.findOne({ where: { requestId } });
      if (existingStory) {
        return next(new AppError("Story already created", 400));
      }
    }

    // IMAGE STORY
    if (req.file) {
      cloudinary.uploader
        .upload_stream(
          { folder: "facebook_clone/stories" },
          async (error, uploadResult) => {
            if (error || !uploadResult) {
              return next(new AppError("image upload failed", 500));
            }

            const story = await Story.create({
              userId,
              image: uploadResult.secure_url,
              requestId,
            });

            return res.status(201).json({
              message: "Story created successfully",
              story,
              storyType: "image",
            });
          }
        )
        .end(req.file.buffer);

      return;
    }

    // TEXT STORY
    if (text) {
      const story = await Story.create({
        userId,
        text,
        requestId,
      });

      return res.status(201).json({
        message: "Story created successfully",
        story,
        storyType: "text",
      });
    }

    // neither text nor image
    return next(
      new AppError("Story must contain either text or image", 400)
    );
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};



export const getAllFriendStories = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get accepted friendships (both sender & receiver)
        const friendships = await Friendship.findAll({
            where: {
                status: "accepted"
            }
        });

        // Extract friend IDs
        let friendIds = friendships
            .filter(f => f.senderId === userId || f.receiverId === userId)
            .map(f => (f.senderId === userId ? f.receiverId : f.senderId));

        // Add current user
        friendIds.push(userId);

        // Fetch stories
        const stories = await Story.findAll({
            where: { userId: friendIds },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "surName"],
                    include: [
                        {
                            model: Profile, as: 'profile',
                            attributes: ['image']
                        },
                        {
                            model: CoverPhoto, as: 'coverPhoto',
                            attributes: ['image']
                        }
                    ]
                }
            ]
        });

        res.status(200).json({
            status: 'success',
            message: 'story has been fetched successfully',
            stories
        })

    } catch (error) {
        console.error(error);
      next(new AppError(error.message, 500))
    }
};
