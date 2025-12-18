import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const ChatMessage = dbConnection.define(
    'ChatMessage',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        participantId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'chatMessages',
        timestamps: true
    }
);

export default ChatMessage;