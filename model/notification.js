import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const Notification = dbConnection.define(
    'Notification',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        notification: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        senderProfile: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    },
    {
        tableName: 'notifications',
        timestamps: true
    }
);

export default Notification;