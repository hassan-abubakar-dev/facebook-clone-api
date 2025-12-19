import cors from 'cors';

const allowOrigins = ['http://localhost:5173', 'https://facebook-clone-frontend-delta.vercel.app', 'https://snazzy-dusk-a9ca96.netlify.app']; 

const corOptions = cors({
    origin: (origin, cb) => {
            if(!origin){
              return  cb(null, true) 
            };
            if(allowOrigins.includes(origin)){
               return cb(null, true);
            }
            else{
               return  cb(new Error('this origin is not allow in my backend', 400), false)
            }
        },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['content-Type', 'Authorization']
});

export default corOptions;