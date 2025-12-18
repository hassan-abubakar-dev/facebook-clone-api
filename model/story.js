import { DataTypes } from "sequelize";
import { dbConnection } from "../config/db.js";

const Story = dbConnection.define(
    'Story',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        image: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
         requestId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
         }
    },
    {
        tableName: 'stories',
        timestamps: true
    }
);

export default Story;
