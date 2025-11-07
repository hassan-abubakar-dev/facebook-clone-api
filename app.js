import express from 'express';
import dotenv from 'dotenv';
import { dbConnection, testConnection } from './config/db.js';
import User from './model/user.js';
import VerificationCode from './model/verificationCode.js';
import authsRouter from './routes/auths.js';
import globalErrorHandler from './middleware/globalError.js';
import security from './security/helmet.js';
import corOptions from './config/cors.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(corOptions);
app.use(security);

app.use(express.json());     
app.use('/api/auths', authsRouter); 
app.use(globalErrorHandler);
console.log(crypto.randomUUID());

app.listen(3000, '0.0.0.0', () => {
    console.log(`app is running on localhost:${PORT}`);
    
});   

testConnection();   
(async()=>{ 
    try{
       await dbConnection.sync({force: true});
    
        console.log('all models are sync successfully'); 
    
    }    
    catch(err){
        console.log(err.message);
        
    }
})();
