import express from "express";
import { getMyProfile, register, login, logout, loginPage, registerPage } from "../controllers/users.js";
import { isAuthenticated } from "../Middlewares/isAuth.js";

const router = express.Router();

router.post('/register', register);

router.get('/register', registerPage)

router.post('/login', login);

router.get('/login', loginPage);

// router.get('/logout', isAuthenticated, logout);

router.post('/logout', logout)

router.get('/me', isAuthenticated, getMyProfile);

export default router;