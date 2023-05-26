import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";

export const register = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    // console.log(req.body)
    let user = await Users.findOne({ email })

    if (user) {
        return res.json({
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

    return res.redirect('/users/recovery-mail')
}

export const registerPage = async (req, res) =>{
    return res.render('register')
}

export const recoveryMailPage = (req, res) =>{
    return res.render('recovery-mail')
}

export const recoveryMail = async (req, res) =>{
    const {recoveryGmail} = req.body;
    // console.log(recoveryGmail)
    let user = await Users.findOne({recoveryGmail});
    console.log(user);
    if (user) {
        return res.render('recovery-mail', {message: "Gmail already registered"});
    }
    user = await Users.create({recoveryGmail});
    return res.redirect('/users/login');
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

export const forgetPasswordPage = (req, res) =>{
    return res.render('forget-password')
}

export const forgetPassword = async (req, res) =>{
    const {email} = req.body;
    console.log(email)
    const user = await Users.findOne({email});
    console.log(user)
    return res.status(200).redirect('reset-password')

}

export const resetPasswordPage = (req, res) =>{
    return res.render('reset-password');
}

export const resetPassword = (req, res) =>{
    res.status(200).json({
        success: true,
        message: "reset done"
    })
}

export const getMyProfile = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}
