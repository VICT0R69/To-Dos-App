import mongoose from "mongoose";

// Database Connection 
export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
}