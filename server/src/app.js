import express from "express";
export const app = express();
import { userRouter } from "./routes/userRoutes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);
