import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const ChatRoom = dbConnection.define(
    'ChatRoom',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        status: {
            type: DataTypes.ENUM('private', 'group'),
            defaultValue: 'private',
            allowNull: false
        }
    },
    {
        tableName: 'chatRooms',
        timestamps: true
    }
);

export default ChatRoom;