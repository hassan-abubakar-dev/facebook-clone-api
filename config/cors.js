import cors from 'cors';

const corOptions = cors({
    origin: ['http://localhost:5173', 'http://192.168.1.175:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
});

export default corOptions;