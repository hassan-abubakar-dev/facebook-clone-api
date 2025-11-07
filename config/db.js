import { Sequelize } from "sequelize";
import doten from 'dotenv'
doten.config()
export const dbConnection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: process.env.NODE_ENV === 'development'? console.log : false
    }
);
 
export const testConnection = async() => {
    try{
        await dbConnection.authenticate();
        console.log('database connection successful');
        
    }
    catch(err){
        console.log('database connection fail ', err.message);
        
    }
};