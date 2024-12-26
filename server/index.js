import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoute.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';
dotenv.config();

const app=express();
const port=process.env.PORT || 3001;
const databseUrl=process.env.MONGO_URL;
app.use(cors({
    origin: [process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}));
app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messagesRoutes);
app.use("/api/channel",channelRoutes);

mongoose.connect(databseUrl).then(()=>
    console.log("Database connected Sucessfully")
)

app.get("/",(req,res)=>{
    res.send("Hello world");
})
const server=app.listen(port,()=>{
    console.log(`Port is running Succesfully ${port}`);
})
setupSocket(server);
