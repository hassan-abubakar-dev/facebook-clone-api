import CoverPhoto from '../model/coverPhoto.js';
import Feedback from '../model/feedback.js';
import Profile from '../model/profile.js';
import User from '../model/user.js';
import AppError from '../utils/AppError.js';

 
    // Create feedback
   export const  createFeedback = async(req, res, next) => {
        try {
            const { message } = req.body;
            const userId = req.user.id; 

            if (!message) {
                return res.status(400).json({ message: 'Feedback message is required' });
            }

            const feedback = await Feedback.create({ message, userId });
             res.status(201).json({ message: 'Feedback submitted successfully', feedback });
        } catch (err) {
            console.error(err);
            next(new AppError('Something went wrong while submitting feedback', 500)) 
        }
    }

  
    export const  getAllFeedback = async(req, res, next)  => {
        try {
            const feedbacks = await Feedback.findAll({ 
                include: {
                    model: User, attributes: ['firstName', 'surName'],
                    include: [
                        {
                            model: CoverPhoto, as: 'coverPhoto', attributes: ['image']
                        },
                        {
                            model: Profile, as: 'profile', attributes: ['image']
                        }
                    ]
                },
                order: [['createdAt', 'DESC']],
            });
            res.status(200).json({ 
                status: 'success',
                message: 'feedback fetched successfully',
                feedbacks
            });
        } catch (err) {
            console.error(err);
            next(new AppError(err.message, 500));
        }
    }

   
  