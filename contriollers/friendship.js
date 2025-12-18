import { Op } from "sequelize";
import CoverPhoto from "../model/coverPhoto.js";
import Friendship from "../model/frienship.js";
import Profile from "../model/profile.js";
import User from "../model/user.js";
import AppError from "../utils/AppError.js"
import { getIo } from "../socket/index.js";
import Notification from "../model/notification.js";
import Post from "../model/post.js";



export const addFriend = async(req, res, next) => {
    try{
        const {receiverId} = req.params;
        const senderId = req.user.id;

        const io = getIo();
        
        if(senderId === receiverId){
            return next(new AppError('you can sent request to your self', 400)); // here will help
        }

        const existingFriendRequest = await Friendship.findOne({where: {senderId, receiverId}});

        if(existingFriendRequest){
            return next(new AppError('sorry this request already exist', 400));
        }
        
        await Friendship.create({
            senderId,
            receiverId
        }); 
        const senderProfile = await Profile.findOne({where: {userId: senderId}});
        const notification = `${req.user.firstName} ${req.user.surName} sent you a friend request`;

        io.to(`user-${receiverId}`).emit('new-notification', {
            notification,
            receiverId,
            senderProfile: senderProfile.image
        });

        try{
            await Notification.create({
                notification,
                receiverId,
                senderProfile: senderProfile.image
            });
        }
        catch(err){
            console.log(err);
            
        }

        res.status(200).json({
            status: 'success',
            message: 'user has been added as your friend and he willsee your request'
        });
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 500));
    };
};

export const receiveFriend = async(req, res, next) => {
    try{
        const {senderId} = req.params;
        const receiverId = req.user.id;

        const io = getIo();

        const isFriendrequestExist = await Friendship.findOne({
            where: {senderId, receiverId}
        });

        if(!isFriendrequestExist){
            return next (new AppError('you not recieve request from this user', 400));
        };

        await Friendship.update({
            status: 'accepted'
        },
         {where: {senderId, receiverId, status: 'pending'}}
        );

        const sender = await User.findOne({where: {id: receiverId}});
        const senderProfile = await Profile.findOne({where: {userId: receiverId}});

 const notification = `${sender.firstName} ${sender.surName}  accept your request`; 
          io.to(`user-${senderId}`).emit('new-notification', {
            notification,
            receiverId: senderId,
            senderProfile: senderProfile.image
        }); // here is correct because fro rendering front end just use receiver id as key no matter which id is

        try{
            await Notification.create({
                notification,
                receiverId: senderId,
                senderProfile: senderProfile.image
            });
        }
        catch(err){
            console.log(err);
            
        }

        res.status(200).json({
            status: 'success',
            message: 'friend accepted successfully'
        });
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 500));
    };
};

export const cancelFriendRequest = async(req, res, next) => { 
    try{
        const {receiverId} = req.params;
        const senderId = req.user.id;

        const isFriendrequestExist = await Friendship.findOne({
            where: {senderId, receiverId, status: 'pending'}
        });

        if(!isFriendrequestExist){
            return next(new AppError("you can't cancel request that not sent yet", 400)); // is is error i see to client
        }
         await Friendship.destroy({where: {receiverId, senderId, status: 'pending'}});

         res.status(200).json({
            status: 'success',
            message: 'request has cancelled'
         });
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 500));
    };
};

export const deleteFriendRequest = async(req, res, next) => { 
    try{
        const {senderId} = req.params;
        const receiverId = req.user.id

           const isFriendrequestExist = await Friendship.findOne({
            where: {senderId, receiverId}
        });

        if(!isFriendrequestExist){
            return next(new AppError("you can't delete request that not sent yet", 400));
        }
         await Friendship.destroy({where: {senderId, receiverId, status:'pending'}});

         res.status(200).json({
            status: 'success',
            message: 'request has deleted'
         });
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 500));
    };
};

export const getFriendRequest = async(req, res, next) => {
    try{
        const receiverId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        
        const offset = (page - 1) * limit;
        
       const allFriendRequest = await Friendship.findAndCountAll({
        where: {receiverId, status: 'pending'},
        include: [
            {
                model: User, 
                as: 'sender',
                attributes: ['id', 'firstName', 'surName', 'gender', 'pronoun'],
                include: [
                    {model: Profile, as: 'profile',
                        attributes: ['image']
                    },
                    {
                        model: CoverPhoto, as: 'coverPhoto',
                        attributes: ['image']
                    },
                      {
                    model: Post
                },
                ]
            }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
       });

       if(allFriendRequest.rows.length === 0){
         return next(new AppError('you not have friend request yet', 400));
       }
       const count = allFriendRequest.rows.length;
        res.status(200).json({
            status: 'success',
            message: 'people sent you friend request has fetched successfully',
            friendRequests: allFriendRequest.rows,
            count,
            totalFriendRequest: allFriendRequest.count
        });
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 500));
    };
};

export const getAllfriends = async (req, res, next) => {
  try {
    const receiverId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const { query } = req.query;
    const offset = (page - 1) * limit;

    // Base friendship where condition
    const where = {
      [Op.or]: [
        { receiverId },
        { senderId: receiverId }
      ],
      status: "accepted"
    };

    // Build include for sender and receiver
    const include = [
      {
        model: User,
        as: "sender",
        attributes: ["id", "firstName", "surName", "gender", "pronoun"],
        include: [
          { model: Profile, as: "profile", attributes: ["image"] },
          { model: CoverPhoto, as: "coverPhoto", attributes: ["image"] },
            {
                              model: Post
             }
                           
        ]
      },
      {
        model: User,
        as: "receiver",
        attributes: ["id", "firstName", "surName", "gender", "pronoun"],
        include: [
          { model: Profile, as: "profile", attributes: ["image"] },
          { model: CoverPhoto, as: "coverPhoto", attributes: ["image"] },
            {
                    model: Post
                }
        ]
      }
    ];



    // QUERY DB
    const getAllfriends = await Friendship.findAndCountAll({
      where,
      include,
      offset,
      limit,
      order: [["createdAt", "DESC"]]
    });

    if (getAllfriends.rows.length === 0) {
      return next(new AppError("you not have friend yet", 400));
    }

    const count = getAllfriends.rows.length;

    // Format friends list so sender/receiver becomes "actual friend"
    const friends = getAllfriends.rows.map(row => {
      const friendship = row.toJSON();

      const actualFriend =
        friendship.sender.id === receiverId
          ? friendship.receiver
          : friendship.sender;

      return {
        ...friendship,
        sender: actualFriend,
        receiver: actualFriend
      };
    });

    res.status(200).json({
      status: "success",
      message: "your friends fetched successfull",
      friends,
      count,
      totalFriends: getAllfriends.count
    });

  } catch (error) {
    console.error(error);
    next(new AppError(error.message, 500));
  }
};


export const deleteFriend = async(req, res, next) => {
    try{
        const {senderId} = req.params;
        const receiverId = req.user.id;

        const isFriendExist = await Friendship.findOne({
            where: {senderId, receiverId, status: 'accepted'}
        });

        if(!isFriendExist){
            return next(new AppError("you can't delete uknown friend", 400));
        }

        await Friendship.destroy({
            where: {senderId, receiverId, status: 'accepted'}
        });

        res.status(200).json({
            status: 'success',
            message: 'thsi friend deleted successfully'
        });
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 5000));
    };
};
