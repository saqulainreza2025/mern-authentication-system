import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routes/users.route.js";
import errorHandler from "./middleware/errorHandler.js";

//Configuration dotenv
dotenv.config();

//App object is created
const app = express();

//Middlewares
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true })); //Cookie will wil send as a response
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/v1/users", userRouter);

//Error Handler
app.use(errorHandler);

//Export the app bczo we will handle everything in index.js
export { app };
