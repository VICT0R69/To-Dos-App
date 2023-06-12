import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import nodemailer from 'nodemailer';
import { name } from "ejs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    let user = await Users.findOne({ email })

    if (user) {
        return res.render('register', {message: "User already registered"})
    }
    if (password !== confirm_password ) {
        return res.render('register', {message: "Confirm password not matched"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await Users.create({ name, email, password: hashedPassword });
    // console.log(user)

    sendCookie(user, res, 201)

    return res.redirect(`/users/recovery-mail/${user.id}`)
}

export const registerPage = async (req, res) =>{
    return res.render('register')
}

export const recoveryMailPage = (req, res) =>{
    return res.render('recovery-mail', {id: req.params.id})
}

export const recoveryMail = async (req, res) =>{

    const {recoveryGmail} = req.body;
    console.log(req.params)

    let user = await Users.findOne({_id: req.params.id});
    console.log(user);
    if (!user) {
        return res.render('recovery-mail', {message: "User not found"});
    }
    user.recoveryMail = recoveryGmail;
    await user.save();

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
        return res.status(404).render('login', {message: "Invalid email or password"})
    }
    console.log(`user ${user}`)

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
    // console.log(email)

    const user = await Users.findOne({email});
    // console.log(user.id)

    const Token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    res.cookie("recoveryDetail", Token, {
        maxAge: 30 * 1000 * 60
    })

    const OTPgenerator = () =>{
        let verificationCode = Math.round(1000 + Math.random()*9000);
        let arr = verificationCode.toString().split('');
        
        while(arr[0]===arr[1] && arr[2]===arr[3] && arr[0]===arr[3]){
            verificationCode = Math.round(1000 + Math.random()*9000);
            arr = verificationCode.toString().split('');
        }
    
        return verificationCode
    }
    const otp = OTPgenerator();
    user.OTP = otp;
    await user.save();
    console.log(otp)

    if (user.recoveryMail === ""){
        return res.render('forget-password', {message: "Recovery mail not found"})
    }
    
    if(user.recoveryMail !== ""){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            }
        })

        const info = transporter.sendMail({
            from: process.env.USER,
            to: user.recoveryMail,
            subject: "ToDos App password recovery",
            html: `<p>hello ${user.name}, ${otp} is your your secret OTP to reset your password. Do not share it with anyone.</p>`
        })
    }
    res.redirect('/users/otp')
}

export const OTPpage = async (req, res) =>{
    return res.render('OTP')
}

export const OTP = async (req, res) =>{
    const {inputOne, inputTwo, inputThree, inputFour} = req.body;

    if(!inputOne || !inputTwo || !inputThree || !inputFour){
        return res.render('OTP', {message: "Invalid Otp"})
    }

    const userOtp = parseInt(inputOne + inputTwo + inputThree + inputFour);

    const {recoveryDetail} = req.cookies

    if (!recoveryDetail){
        return res.redirect('/users/forget-password')
    }

    const decoded = jwt.verify(recoveryDetail, process.env.JWT_SECRET)
    console.log(decoded)

    const user = await Users.findById(decoded._id)
    console.log(user)

    if(!user){
        return res.redirect('/users/forget-password')
    }

    if (userOtp !== user.OTP){
        return res.render('OTP', {message: "Invalid Otp"})
    }
    
    user.OTP = null;
    await user.save();

    return res.redirect('/users/reset-password')
}

export const resetPasswordPage = (req, res) =>{
    return res.render('reset-password');
}

export const resetPassword = async (req, res) =>{

    const {recoveryDetail} = req.cookies;
    const {new_password, confirm_new_password} = req.body;

    if(new_password !== confirm_new_password){
        return res.render('reset-password', {message: "Confirm password not matched"})
    }

    const decoded = jwt.verify(recoveryDetail, process.env.JWT_SECRET)

    // console.log(decoded ,new_password, confirm_new_password)
    
    const user = await Users.findById(decoded._id).select("+password")
    
    if (!user){
        return res.redirect('/users/forget-password')
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    // console.log("hashed",hashedPassword)

    const updatePassword = await Users.updateOne({password: user.password}, {$set: {password: hashedPassword}});
    await user.save();
    
    
    console.log(updatePassword)

    // user.password = new_password;
    // await user.save();

    res.redirect('/users/login')

}

export const getMyProfile = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}
