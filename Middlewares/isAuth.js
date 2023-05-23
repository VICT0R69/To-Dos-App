import jwt from "jsonwebtoken";
import { Users } from "../models/user.js";

export const isAuthenticated = async (req, res, next)=>{
    const {Token} = req.cookies;
    if(!Token){
        return res.redirect('/users/login')
    }

    const decoded = jwt.verify(Token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded._id);
    next();
}