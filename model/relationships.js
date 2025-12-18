import Friendship from "./frienship.js";
import Like from "./like.js";
import Post from "./post.js";
import Profile from "./profile.js";
import Story from "./story.js";
import Comment from "./comment.js";
import User from "./user.js";
import verificationCode from "./verificationCode.js";
import CoverPhoto from "./coverPhoto.js";
import ChatParticipant from "./chatParticipant.js";
import ChatRoom from "./chatRoom.js";
import ChatMessage from "./chatMessage.js";
import Notification from "./notification.js";
import Feedback from "./feedback.js";

//user and veeificationcode
User.hasOne(verificationCode, {
    foreignKey: 'userEmail',
    sourceKey: 'email'
});

verificationCode.belongsTo(User, {
    foreignKey: 'userEmail',
    targetKey: 'email'
}); 

// user with friends
User.hasMany(Friendship, {
    as: 'sender',
    foreignKey: 'senderId'
});

User.hasMany(Friendship, {
    as: 'seceiver',
    foreignKey: 'receiverId'
});

Friendship.belongsTo(User, {
    as: 'sender',
    foreignKey: 'senderId'
});

Friendship.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiverId'
});

// user and story
User.hasMany(Story, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Story.belongsTo(User, {
    foreignKey: 'userId'
});

// user and profile
User.hasOne(Profile, {
    foreignKey: 'userId',
    as: 'profile',
    onDelete: 'CASCADE'
});


Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'profile'
});

// user and coverphoto
User.hasOne(CoverPhoto, {
    foreignKey: 'userId',
    as: 'coverPhoto',
    onDelete: 'CASCADE'
});
CoverPhoto.belongsTo(User, {
    foreignKey: 'userId',
    as: 'coverPhoto'
});


// user and post
User.hasMany(Post, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'userId'
});

// user and comment
User.hasMany(Comment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
    foreignKey: 'userId'
});

// comment and post
Post.hasMany(Comment, {
    foreignKey: 'postId',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
    foreignKey: 'postId'
})

// user and like
User.hasMany(Like, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Like.belongsTo(User, {
    foreignKey: 'userId'
});

// like and post
Post.hasMany(Like, {
    foreignKey: 'postId',
   onDelete: 'CASCADE'
}); 

Like.belongsTo(Post, {
    as: 'postLike',
    foreignKey: 'postId'
    
});

// user and participant
User.hasMany(ChatParticipant, {
    as: 'participant',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
ChatParticipant.belongsTo(User, {
    as: 'participant',
    foreignKey: 'userId'
});

// participant with room
ChatRoom.hasMany(ChatParticipant, {
    as: 'roomParticipant',
    foreignKey: 'roomId'
});

ChatParticipant.belongsTo(ChatRoom, {
     as: 'roomParticipant',
    foreignKey: 'roomId'
});

// message with participant
ChatParticipant.hasMany(ChatMessage, {
    as: 'messageSender',
    foreignKey: 'participantId',
    onDelete: 'CASCADE'
});

ChatMessage.belongsTo(ChatParticipant, {
     as: 'messageSender',
    foreignKey: 'participantId'
});

// message with its room
ChatRoom.hasMany(ChatMessage, {
    as: 'roomMessage',
    foreignKey: 'roomId', 
});

ChatMessage.belongsTo(ChatRoom, {
    as: 'roomMessage',
    foreignKey: 'roomId'
});

// new, user with notifications
User.hasMany(Notification, {
    as: 'userNotification',
    foreignKey: 'receiverId',
    onDelete: 'CASCADE'
});

Notification.belongsTo(User, {
    as: 'userNotification',
    foreignKey: 'receiverId'
});

// user and feedback
User.hasMany(Feedback, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Feedback.belongsTo(User, {
    foreignKey: 'userId'
});