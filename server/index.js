import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';
import http from 'http';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

const corsOptions = {
    origin: "*",
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true
};

app.use(cors(corsOptions))
app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messagesRoutes)
app.use('/api/channel', channelRoutes)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong!');
});

const server = http.createServer(app);
const io = setupSocket(server);

server.listen(port);

mongoose.connect(databaseURL)
    .then(()=>
    console.log("Database Connected Successfully"))
    .catch(err=>console.error(err.message))

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});