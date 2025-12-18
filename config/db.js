import { Sequelize } from "sequelize";
import doten from 'dotenv'
doten.config();

export const dbConnection = new Sequelize(
  process.env.DB_URL,
  {
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
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