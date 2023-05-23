import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";

export const register = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    console.log(req.body)
    let user = await Users.findOne({ email })

    if (user) {
        return res.status(404).json({
            success: false,
            message: "User Already Registered"
        })
    }
    if (password !== confirm_password ) {
        return res.render('register', {message: "Confirm password not matched"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await Users.create({ name, email, password: hashedPassword });

    sendCookie(user, res, 201)

    return res.redirect('/users/login')
}

export const registerPage = async (req, res) =>{
    res.render('register')
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
        return res.status(404).render('login', {message: "User not found"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(404).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }
    console.log(`req.user ${user}`)

    sendCookie(user, res, 201)
    res.redirect('/')
}

export const loginPage = (req, res) =>{
    return res.render('login')
}

export const logout = (req, res) =>{
    res.clearCookie("Token");
    return res.redirect('/users/login')
    
}

export const getMyProfile = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}
