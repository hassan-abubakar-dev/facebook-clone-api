import Comment from "../model/comment.js";
import CoverPhoto from "../model/coverPhoto.js";
import Profile from "../model/profile.js";
import User from "../model/user.js";
import AppError from "../utils/AppError.js";


// ➤ CREATE COMMENT
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params; 
    const userId = req.user.id; // from auth middleware
    const {comment} = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = await Comment.create({
      comment,
      userId,
      postId
    });


    const fullComment = await Comment.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: User,
          attributes: ["id", 'firstName', "surName"],
          include: [
            {
              model: Profile, as: 'profile',
              attributes:['image']
            },
            {
              model: CoverPhoto, as: 'coverPhoto',
              attributes: ['image']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: "Comment added",
      comment: fullComment
    });

  } catch (err) {
    console.error(err);;
    next(new AppError(err.message, 500))
  }
};



// ➤ GET ALL COMMENTS FOR A POST
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "profileImage"]
        }
      ]
    });

    res.status(200).json({
      count: comments.length,
      comments
    });

  } catch (err) {
     console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};



// ➤ DELETE COMMENT (only the owner)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.destroy();

    res.status(200).json({ message: "Comment deleted" });

  } catch (err) {
     console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
