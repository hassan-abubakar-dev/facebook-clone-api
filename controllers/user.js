import { Op } from "sequelize";
import AppError from "../utils/AppError.js"
import User from "../model/user.js";
import Profile from "../model/profile.js";
import CoverPhoto from "../model/coverPhoto.js";
import Friendship from "../model/frienship.js";
import Post from "../model/post.js";


export const getUsers = async(req, res, next) => {
    try{
        
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const {query} = req.query;
        const userId = req.user.id;
        const offset = (page - 1) * limit;

        const userFriends = await Friendship.findAll({
            where: {senderId: userId, status: 'accepted' }
        });

        const allExcludedFriends = await Friendship.findAll({
            where: {
                [Op.or]: [{
                    senderId: userId
                },
                {
                    receiverId: userId
                }
            
            ]
            } 
        });

        const allExcludedIds = allExcludedFriends.map(friends => friends.senderId === userId ? friends.receiverId : friends.senderId)
      
        const where = {
            isVerify: true,
            id: {
                [Op.ne]: userId,
                [Op.notIn]: [...allExcludedIds]
            }
           
        };

        if(query){
            const words = query.trim().split(' ');

            where[Op.and] = words.map(word => {
                return {
                    [Op.or]: [
                        {
                            firstName: {[Op.like]: `%${word}%`}
                        },
                        {
                            surName: {[Op.like]: `%${word}%`}
                        }
                    ]
                }
            })
        }

        const users = await User.findAll({
            where,
            offset,
            limit,
            attributes: ['id', 'firstName', 'surName', 'gender', 'pronoun'],
            include: [
                {
                    model: Profile, as: 'profile',
                    attributes: ['image'],
                    
                },
                {
                    model: Post
                },
                {
                    model: CoverPhoto, as: 'coverPhoto',
                    attributes: ['image']
                },
            
            ],
           order: [["id", "DESC"]]
        });

   

        res.status(200).json({
            status: 'success',
            message: 'users fetched successfully',
            users,
            count: users.length
        });
    }
    catch(err){
        next(new AppError(err.message, 500));
    };
};

export const getCurrentUser = async(req, res, next) => {
    try{
        const id = req.user.id;
        const existingUser = await User.findOne({where: {id, isVerify: true}, 
            attributes: ['id', 'firstName', 'surName', 'dateOfBirth', 'gender', 'pronoun', 'role'],
            include: [
                {model: Profile, as: 'profile',
                    attributes: ['image']
                },
              
                {model: CoverPhoto, as: 'coverPhoto',
                    attributes: ['image']
                },
                  {
                    model: Post
                }
                 
            ]
        },
        
        );

        if(!existingUser){
            return next(new AppError('you are not verify', 400));
        }

        res.status(200).json({
            status: 'success',
            message: 'you have successfully get your information',
            user: existingUser
        });
    }
    catch(err){
        
        
        next(new AppError(err.message, 500));
    };
};