import express from 'express';
import { newTask, getMyTask, updateTask, deleteTask, clearAll } from '../controllers/task.js';
import { isAuthenticated } from '../Middlewares/isAuth.js';
const router = express.Router();

router.post("/new", isAuthenticated, newTask);

router.get('/my', isAuthenticated, getMyTask);

router.post('/clearAll', isAuthenticated, clearAll);

router.post('/delete/:id', isAuthenticated, deleteTask)


export default router;
