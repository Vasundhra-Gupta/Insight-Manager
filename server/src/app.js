import express from "express";
export const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("../public"));
app.use(cookieParser());

import {
    userRouter,
    postRouter,
    followerRouter,
    commentRouter,
    likeRouter,
    migrationRouter,
} from "./routes/index.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/followers", followerRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/migrations", migrationRouter);
