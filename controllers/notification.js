import Notification from "../model/notification.js";
import AppError from "../utils/AppError.js";
export const getNotification = async(req, res, next) => {
    try{
        const receiverId = req.user.id;
        const page = parseInt(req.query.page) 
        console.log(page);
        
        const limit = 30;
        const offset = (page - 1) * limit;

        const notifications = await Notification.findAll({
            where:{receiverId},
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'successs',
            message: 'notification has fetched successfully',
            notifications,
            count: notifications.length
        });
    }
    catch(err){
        console.log(err);
        next(new AppError(err.message, 500))
    }
}