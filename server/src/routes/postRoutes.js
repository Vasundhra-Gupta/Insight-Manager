import express from "express";
export const postRouter = express.Router();
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { optionalVerifyJwt } from "../middlewares/optionalAuthMiddleware.js";

import { getPost, getPosts, getRandomPosts, deletePost, updatePostDetails,updatePostImage, togglePostVisibility, addPost } from "../controllers/postController.js";

postRouter.route("/random").get(getRandomPosts);

postRouter.route("/").get(getPosts);

postRouter.route("/:postId").get(optionalVerifyJwt, getPost);

postRouter.use(verifyJwt);

postRouter.route("/add").post(upload.single("postImage"), addPost);

postRouter.route("/:postId").delete(deletePost).patch(updatePostDetails);

postRouter.route("/updateImage/:postId").patch(upload.single("postImage"), updatePostImage);

postRouter.route("/toggle/:postId", togglePostVisibility);
