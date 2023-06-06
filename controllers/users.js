import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import nodemailer from 'nodemailer';
import { name } from "ejs";

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
    req.params = user.id
    console.log(user)

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
    // console.log(user.name)

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
    console.log(inputOne, inputTwo, inputThree, inputFour)

    if(inputOne !== "" && inputTwo !== "" && inputThree !== "" && inputFour !== ""){
        // res.render('OTP', {message: "digit is missing"})
        return res.redirect('/users/reset-password')
    }

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
