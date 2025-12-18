import { Server } from "socket.io";
import ChatMessage from "../model/chatMessage.js";
import ChatParticipant from "../model/chatParticipant.js";

let io;

 const socketInit = (httpServer) => {

     io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        const {userId} = socket.handshake.query;
        socket.join(`user-${userId}`);

        socket.on('new-connection', (data) => {
             socket.roomId = data.roomId;
             socket.senderParticipantId = data.senderParticipantId;

              console.log('socket.senderParticipantId as participantId', socket.senderParticipantId);
            socket.join(`room-${socket.roomId}`);

        });
          socket.on('new-message',async (data) => {

                // sent it
                io.to(`room-${socket.roomId}`).emit('new-message', {
                    id: crypto.randomUUID(),
                    senderId: data.senderId,
                    message: data.message
                }); 



             try{
                  await ChatMessage.create({
                    message: data.message,
                    participantId: socket.senderParticipantId,
                    roomId: socket.roomId,
                    senderId: data.senderId
                });
             }
             catch(err){
                console.log(err.message);
                
             }
            });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
    });
};

export default socketInit;

export const getIo = () => {
    return io
};