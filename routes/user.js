import express from "express";
import { getMyProfile, register, login, logout, loginPage, registerPage, forgetPasswordPage, forgetPassword, resetPasswordPage, resetPassword, recoveryMailPage, recoveryMail, OTPpage, OTP } from "../controllers/users.js";
import { isAuthenticated } from "../Middlewares/isAuth.js";

const router = express.Router();

router.route('/register').get(registerPage).post(register);

router.route('/login').get(loginPage).post(login);

router.route('/logout').post(logout);

router.route('/forget-password').get(forgetPasswordPage).post(forgetPassword);

router.route('/otp').get(OTPpage).post(OTP);

router.route('/reset-password').get(resetPasswordPage).post(resetPassword);

router.route('/recovery-mail/:id').get(recoveryMailPage).post(recoveryMail); 

router.get('/me', isAuthenticated, getMyProfile);

export default router;