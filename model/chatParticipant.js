import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const ChatParticipant = dbConnection.define(
    'ChatParticipant',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'chatParticipants',
        timestamps: true
    }
);

export default ChatParticipant;