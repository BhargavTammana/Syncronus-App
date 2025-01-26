import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoutes.js';
dotenv.config();

const app=express();
const port = process.env.PORT||3001;
const databaseURL=process.env.DATABASE_URL;

const corsOptions={
    origin:process.env.ORIGIN,
    methods:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true
};

app.use(cors(corsOptions))

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth',authRoutes)

app.use((err, req, res, next) => {
    // Handle errors
    console.error(err);
    res.status(500).send('Something went wrong!');
});
const server=app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})

mongoose.connect(databaseURL)
    .then(()=>
    console.log("Database Connected Successfully"))
    .catch(err=>console.log(err.message))

    app.use((err, req, res, next) => {
        res.status(500).json({ message: err.message });
      });