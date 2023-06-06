import jwt from 'jsonwebtoken';
export const sendCookie = (user, res, sendStatus = 200)=>{

    const Token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    res.status(sendStatus).cookie("Token", Token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })
}