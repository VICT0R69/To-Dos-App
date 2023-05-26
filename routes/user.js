import express from "express";
import { getMyProfile, register, login, logout, loginPage, registerPage, forgetPasswordPage, forgetPassword, resetPasswordPage, resetPassword, recoveryMailPage, recoveryMail } from "../controllers/users.js";
import { isAuthenticated } from "../Middlewares/isAuth.js";

const router = express.Router();

router.route('/register').get(registerPage).post(register);

router.route('/recovery-mail').get(recoveryMailPage).post(recoveryMail);

router.route('/login').get(loginPage).post(login);

router.route('/logout').post(logout);

router.route('/forget-password').get(forgetPasswordPage).post(forgetPassword);

router.route('/reset-password').get(resetPasswordPage).post(resetPassword);

router.get('/me', isAuthenticated, getMyProfile);

export default router;