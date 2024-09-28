import express from "express";
export const commentRouter = express.Router();
import { verifyJWT } from "../middlewares/index.js";

import { addComment, updateComment, deleteComment, getComments } from "../controllers/commentController.js";

commentRouter.route("/:postId").get(getComments);

commentRouter.use(verifyJWT);

commentRouter.route("/:postId").post(addComment).patch(updateComment).delete(deleteComment);
