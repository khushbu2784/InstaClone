import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/userRouter.js"
import postRoute from "./routes/postRouter.js";
import messageRoute from './routes/messageRouter.js';
import storyRouter from "./routes/storyRouter.js"
import { app,server } from "./socket/socket.js";

dotenv.config();
// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://insta-clone27.vercel.app"],
  credentials: true,
};

// ✅ Always put CORS first
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/story",storyRouter)

//"http://localhost:8000/api/v1/user/register"

// Test route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I'm Coming from backend",
    success: true,
  });
});

// Server start
const PORT = 8000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);
});
