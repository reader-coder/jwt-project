import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./database/connectDB.mjs";
import authRouter from "./routes/authRoutes.mjs";
import userRouter from "./routes/userRoutes.mjs";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [process.env.FRONTEND_URL];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

//API ENDPOINTS
app.get("/", (req, res) => {
  return res.status(200).json("Hello");
});

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log("Something went wrong");
  }
};

start();
