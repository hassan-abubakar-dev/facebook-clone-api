import User from "./user.js";
import VerificationCode from "./verificationCode.js";

User.hasOne(VerificationCode, {
    foreignKey: 'userEmail',
    sourceKey: 'email'
});

VerificationCode.belongsTo(User, {
    foreignKey: 'userEmail',
    targetKey: 'email'
}); 