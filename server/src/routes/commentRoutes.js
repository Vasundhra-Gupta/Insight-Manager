import express from "express";
export const commentRouter = express.Router();
import { verifyJwt } from "../middlewares/index.js";
import { addComment, updateComment, deleteComment, getComments } from "../controllers/commentController.js";

commentRouter.route("/:postId").get(getComments);

commentRouter.use(verifyJwt);

commentRouter.route("/:postId").post(addComment);

commentRouter.route("/:commentId").patch(updateComment).delete(deleteComment);
