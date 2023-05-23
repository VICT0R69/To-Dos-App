import jwt from 'jsonwebtoken';
import nodemon from 'nodemon';
export const sendCookie = (user, res, sendStatus = 200)=>{

    const Token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    res.status(sendStatus).cookie("Token", Token, {
        http: true,
        maxAge: 30 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
    })
}