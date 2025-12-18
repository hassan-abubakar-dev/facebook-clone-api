import { DataTypes } from "sequelize";
import { dbConnection } from "../config/db.js";

const Friendship = dbConnection.define(
    'Friendship',
    {
       senderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted'),
            defaultValue: 'pending',
            allowNull: false
        }
    },
    {
        tableName: 'friendships',
        timestamps: true
    }
);

export default Friendship;