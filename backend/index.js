import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

const uri = process.env.MONGO_URL;
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

// CORS configuration for production
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static('uploads'));

app.listen(PORT, async () => {
    console.log("App started!");
    await mongoose.connect(uri);
    console.log("DB connected!");
});