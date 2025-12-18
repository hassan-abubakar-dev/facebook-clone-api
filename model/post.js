import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const Post = dbConnection.define(
    'Post',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        publicId: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        postColor: {
          type: DataTypes.STRING(25),
          allowNull: true  
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'posts',
        timestamps: true
    }
);

export default Post;