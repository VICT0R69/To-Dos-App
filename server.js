import { connectDB } from './data/database.js';
import { app } from './app.js';

// Database
connectDB();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
})