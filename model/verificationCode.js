import { DataTypes } from "sequelize";
import { dbConnection } from "../config/db.js";

const VerificationCode = dbConnection.define(
    'verificationCode',
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
        tableName: 'verificationCodes',
        timestamps: true
    }
);

export default VerificationCode;