import { Task } from "../models/task.js";
import jwt from "jsonwebtoken";
import { Users } from "../models/user.js";

export const newTask = async (req, res, next) =>{
    const { title, description } = req.body;
    // console.log(title, description)
    await Task.create({
        title,
        description,
        user: req.user
    })

    res.status(201).redirect('/');

}

export const getMyTask = async (req, res) =>{
    const userId = req.user._id;
    const tasks = await Task.find({user: userId});

    res.status(200).json({
        status: true,
        tasks
    })

}

export const updateTask = async (req, res, next) =>{
    try {
        const {id} = req.params;
        const task = await Task.findById(id);
        if (!task){
            return next(new Error("Task not found"))
        }
        task.isCompleted = !task.isCompleted;
        await task.save();

        res.status(200).json({
            status: true,
            message: "Task updated succesfully"
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req, res, next) =>{
try {
    console.log(req.params.id)
    const deleteTask = await Task.deleteOne({_id: req.params.id})
    res.redirect('/')

} catch (error) {
    next(error)
}
}

export const clearAll = async (req, res, next) =>{
    const clearAll = await Task.deleteMany({user: req.user.id});
    res.redirect('/');
}