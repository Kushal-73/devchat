
import mongoose from "mongoose";

//connecting to mongoose
export const connectDB= async()=>{
    try {
        const con=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        console.log("error connecting to mongoDB");
        process.exit(1);
    }
}