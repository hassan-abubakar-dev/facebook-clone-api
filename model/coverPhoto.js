import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const CoverPhoto = dbConnection.define(
    'CoverPhoto',
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
        publicId: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'coverPhotos',
        timestamps: true
    }
);

export default CoverPhoto;