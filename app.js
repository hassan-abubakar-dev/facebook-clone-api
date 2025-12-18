import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { dbConnection, testConnection } from './config/db.js';
import ChatMessage from './model/chatmessage.js';
import ChatParticipant from './model/chatParticipant.js';
import ChatRoom from './model/chatRoom.js';
import User from './model/user.js';
import VerificationCode from './model/verificationCode.js';
import authsRouter from './routes/auths.js';
import globalErrorHandler from './middleware/globalError.js';
import security from './security/helmet.js';
import corOptions from './config/cors.js';
import Friendship from './model/frienship.js';
import frienshipRouter from './routes/friendship.js'
import profileRouter from './routes/profile.js'
import Profile from './model/profile.js';
import userRouter from './routes/user.js'
import coverPhotoRouter from './routes/coverPhoto.js';
import cookieParser from 'cookie-parser';
import './model/relationships.js'
import socketInit from './socket/index.js';
import chatRouter from './routes/chat.js';
import Notification from './model/notification.js';
import notificationRouter from './routes/notification.js';
import postRouter from './routes/post.js';
import likeRouter from './routes/like.js';
import commentRouter from './routes/comment.js';
import storyRouter from './routes/story.js';
import {createAdmin} from './config/admin.js'
import feedbackRouter from './routes/feedback.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
socketInit(httpServer); 

  

app.use(corOptions); 
app.use(security);

app.use(express.json());  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 
app.use(cookieParser());  
app.use('/api/auths', authsRouter); 

app.use('/api', frienshipRouter);
app.use('/api', profileRouter)
app.use('/api', userRouter);
app.use('/api', coverPhotoRouter);
app.use('/api/chat', chatRouter);
app.use('/api/notification', notificationRouter);
app.use('/api', postRouter);
app.use('/api', likeRouter);
app.use('/api', commentRouter);
app.use('/api', storyRouter);
app.use('/api', feedbackRouter)


app.use(globalErrorHandler);


httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`app is running on :${PORT}`); 
    
});    


testConnection();   
(async()=>{
    try{
       await dbConnection.sync({alter: true});   
        await createAdmin();
        console.log('all models are sync successfully');  
      
    }     
    catch(err){
        console.log(err.message); 
        
    }
})();
