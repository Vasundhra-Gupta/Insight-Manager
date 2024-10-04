import express from "express";
export const followerRouter = express.Router();
import { verifyJwt } from "../middlewares/authMiddleware.js";

import { getFollowers, getFollowings, toggleFollow } from "../controllers/followerController.js";

followerRouter.route("/follows/:channelId").get(getFollowings);

followerRouter.route("/toggle-follow/:channelId").post(verifyJwt, toggleFollow);

followerRouter.route("/:channelId").get(getFollowers);
