import ChatMessage from "../model/chatMessage.js";
import ChatParticipant from "../model/chatParticipant.js";
import ChatRoom from "../model/chatRoom.js";
import AppError from "../utils/AppError.js"

export const getRoomId = async(req, res, next) => {
    try{
        const senderId = req.user.id;
        const {receiverId} = req.body;
       let roomId = '';
       let room  = '';

        const senderParticipantRooms = await ChatParticipant.findAll(
            {where: {userId: senderId}}
        );

         const receiverParticipantRooms = await ChatParticipant.findAll(
            {where: {userId: receiverId}}
        );

        const senderRoomsIds = senderParticipantRooms.map(id => id.roomId);
        const receiverRoomsIds = receiverParticipantRooms.map(id => id.roomId);

        roomId = senderRoomsIds.find(id => receiverRoomsIds.includes(id));
        if(!roomId){
            room = await ChatRoom.create({
            status: 'private'
           });

           await ChatParticipant.bulkCreate([
            {
               userId: senderId,
               roomId: room.id
            },
             {
               userId: receiverId,
               roomId: room.id
            }
           ]);
        }

        // now we alredy have the room id and record for the participants
        const senderParticipant = await ChatParticipant.findOne({
            where: {userId: senderId, roomId: roomId ? roomId: room.id} 
        })
        console.log("senderParticipant.id", senderParticipant.id);
        
        res.status(200).json({
            status: 'success',
            message: 'roomId fetched successfully',
            roomId: roomId || room.id,
            senderParticipantId: senderParticipant.id // we not need participant for receiver fro now
        });

    }
    catch(err){
         console.error(err);
        next(new AppError(err.message, 500));
    };
};

export const getChats = async(req, res, next) => {
    try{
       const {roomId} = req.body;
       const messages = await ChatMessage.findAll({
        where: {roomId},
        order: [['createdAt', 'ASC']]
       });  // room id is okay now as we have it in table

       res.status(200).json({
        status: 'success',
        message: 'chats fetched successfully',
        messages
       });
    }
    catch(err){
         console.error(err);
        next(new AppError(err.message, 500));
    };
};