
import mongoose from "mongoose";

//connecting to mongoose
export const connectDB= async()=>{
    try {
        const con=await mongoose.connect('mongodb://127.0.0.1:27017/devchat');
        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        console.log("error connecting to mongoDB");
        process.exit(1);
    }
}