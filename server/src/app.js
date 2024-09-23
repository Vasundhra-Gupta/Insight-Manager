import express from "express";
export const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("../public"));
app.use(cookieParser());


import { userRouter } from "./routes/userRoutes.js";

app.use("/api/v1/users", userRouter);
