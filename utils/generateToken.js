import jwt from 'jsonwebtoken'

const generateToken = (payload, tokenKey, expireTime) => {
    return jwt.sign(payload, tokenKey, {expiresIn: expireTime.trim()});
}

export default generateToken;