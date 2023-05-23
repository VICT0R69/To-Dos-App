import express from 'express';
import userRouter from './routes/user.js';
import taskRouter from './routes/task.js'
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './Middlewares/error.js';
import cors from "cors";
import { isAuthenticated } from './Middlewares/isAuth.js';
import { Task } from './models/task.js'
// import path from 'path';

export const app = express();

config({
    path: "./data/config.env",
})

// Using Middeware
app.set("views", "./views")
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTED_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    Credential: true
}))

// Serving static files 
app.use('/public', express.static("public"));

// Setting Template Engine
app.set('view engine', "ejs");

// Using routes
app.use("/users", userRouter)
app.use('/task', taskRouter)

app.get('/', isAuthenticated, async (req, res)=>{
    try{
        const allTask = await Task.find({user: req.user.id});
        console.log(allTask)
        res.render('index' , {allTask})

    }catch(err){
        console.log(err)
    }
})

// Using error middleware 
app.use(errorMiddleware);