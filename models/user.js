import mongoose from "mongoose";

// Schema 
const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    recoveryMail: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    OTP: {
        type: Number
    }

})

// Model 
export const Users = new mongoose.model("Users-info", schema)