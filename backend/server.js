import express from "express";
import dotenv from "dotenv";
import auth from "./routes/auth.js"
import otherUsers from "./routes/otherUsers.js"
import chat from "./routes/chat.js"
import adminCrud from "./routes/adminCrud.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import path from "path";

import cors from 'cors';

dotenv.config();


const app=express();
const PORT=process.env.PORT;

const __dirname=path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',auth);
app.use('/api/users',otherUsers);
app.use('/api/adminCrud',adminCrud);
app.use('/api/chat',chat);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,'../frontend/dist')));

    app.get('/*splat',(req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT,()=>{
    console.log(`Server running at PORT : ${PORT}`);  
    connectDB();
});