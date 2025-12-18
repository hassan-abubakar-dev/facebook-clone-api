import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const User = dbConnection.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        surName: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('female', 'male', 'custom'),
            allowNull: true
        },
        pronoun: { //pronoun is only when user select a custom gender
            type: DataTypes.STRING(45),
            allowNull: true,
                 
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(100), 
            allowNull: false
        },
        isVerify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        }
    },  
    {
        tableName: 'Users',
        timestamps: true
    }
);

export default User