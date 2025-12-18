import { DataTypes, UUIDV4 } from 'sequelize';
import { dbConnection } from '../config/db.js';
import User from './user.js';

const Feedback = dbConnection.define('Feedback', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    userId: {
         type: DataTypes.UUID,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'feedbacks',
    timestamps: true,
});

Feedback.belongsTo(User, { foreignKey: 'userId', as: 'User' });

export default Feedback;
