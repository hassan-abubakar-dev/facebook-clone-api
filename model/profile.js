import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const Profile = dbConnection.define(
    'Profile',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        image: {
            type: DataTypes.STRING(200),
            allowNull: false
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
        tableName: 'profiles',
        timestamps: true
    }
);

export default Profile;