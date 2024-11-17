import jwt from 'jsonwebtoken';

export const generateToken = (user)=>{
    return token = jwt.sign({
        username: user.username,
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d'
    })
}