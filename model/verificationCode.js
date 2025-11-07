import { DataTypes } from "sequelize";
import { dbConnection } from "../config/db.js";

const VerificationCode = dbConnection.define(
    'VerificationCode',
    {
        code: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        expiryTime: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        userEmail: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    },
    {
        tableName: 'VerificationCodes',
        timestamps: true
    }
);

export default VerificationCode;