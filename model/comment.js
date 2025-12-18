import { DataTypes } from "sequelize";
import { dbConnection } from "../config/db.js";

const Comment = dbConnection.define(
    'Comment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'comments',
        timestamps: true
    }
);

export default Comment;