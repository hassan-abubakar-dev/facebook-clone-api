import Like from "../model/like.js";
import User from "../model/user.js";  
import AppError from "../utils/AppError.js";

//  Toggle Like
export const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; 

    //  Check if like already exists
    const exists = await Like.findOne({
      where: { userId, postId }
    });

    if (exists) {
      //  Remove like (UNLIKE)
      await exists.destroy();

      const count = await Like.count({ where: { postId } });

      return res.status(200).json({
        message: "Post unliked",
        liked: false,
        userId,
        likesCount: count
      });
    }

    //  Create a new like
    await Like.create({ userId, postId });

    const count = await Like.count({ where: { postId } });

    res.status(201).json({
      message: "Post liked",
      liked: true,
      userId,
      likesCount: count
    });

  } catch (error) {
    console.log(error);
   next(new AppError("Server error", 500))
  }
};

//  Get all likes for a post 
export const getLikes = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const likes = await Like.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "profileImage"]
        }
      ]
    });

    res.status(200).json({
      count: likes.length,
      likes
    });

  } catch (error) {
    console.log(error);
    next(new AppError("Server error", 500));
  }
};
