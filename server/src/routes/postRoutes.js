// import express from "express";
// export const postRouter = express.Router();
// import { upload } from "../middlewares/multerMiddleware.js";
// import { verifyJwt } from "../middlewares/authMiddleware.js";
// import { optionalVerifyJwt } from "../middlewares/optionalAuthMiddleware.js";

// import {
//     getPost,
//     getPosts,
//     getRandomPosts,
//     deletePost,
//     updatePostDetails,
//     updatePostImage,
//     togglePostVisibility,
//     addPost,
// } from "../controllers/postController.js";

// postRouter.route("/random-posts").get(getRandomPosts);

// postRouter.route("/user-posts/:userId").get(getPosts);

// postRouter.route("/:postId").get(optionalVerifyJwt, getPost);

// postRouter.use(verifyJwt);

// postRouter.route("/add").post(upload.single("postImage"), addPost);

// postRouter.route("/delete/:postId").delete(deletePost);

// postRouter.route("/update-details/:postId").patch(updatePostDetails);

// postRouter.route("/update-image/:postId").patch(upload.single("postImage"), updatePostImage);

// postRouter.route("/toggle-visibility/:postId", togglePostVisibility);
