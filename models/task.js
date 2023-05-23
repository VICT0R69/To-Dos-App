import mongoose from "mongoose";

// Schema 
const schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users-info"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

// Model 
export const Task = new mongoose.model("Task-info", schema)