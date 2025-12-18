import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";


const Like = dbConnection.define(
    'Like',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, 
    {
        tableName: 'likes',
        timestamps: true
    }
);

export default Like;