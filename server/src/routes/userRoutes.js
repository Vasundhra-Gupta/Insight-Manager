import express from "express";
export const userRouter = express.Router();
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { optionalVerifyJwt } from "../middlewares/optionalAuthMiddleware.js";

import {
    registerUser,
    loginUser,
    logoutUser,
    deleteAccount,
    updateAccountDetails,
    updateAvatar,
    updateChannelDetails,
    updatePassword,
    updateCoverImage,
    getChannelProfile,
    getCurrentUser,
} from "../controllers/userController.js";

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);

userRouter.route("/profile/:username").get(optionalVerifyJwt, getChannelProfile);

userRouter.route("/login").post(loginUser);

userRouter.use(verifyJwt);

userRouter.route("/logout").get(logoutUser);

userRouter.route("/delete-account").delete(deleteAccount);

userRouter.route("/current-user").get(verifyJwt, getCurrentUser);

userRouter.route("/update-account-details").patch(updateAccountDetails);

userRouter.route("/update-channel-details").patch(updateChannelDetails);

userRouter.route("/update-password").patch(updatePassword);

userRouter.route("/avatar").patch(upload.single("avatar"), updateAvatar);

userRouter.route("/cover-image").patch(upload.single("coverImage"), updateCoverImage);
