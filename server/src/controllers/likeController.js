import { SERVER_ERROR } from "../constants/errorCodes.js";
import getServiceObject from "../db/serviceObjects.js";

const likeObject = getServiceObject("likes");

const getLikedPosts = async (req, res) => {
    try {
        const { user_id } = req.user;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        const likedPosts = await likeObject.getLikedPosts(user_id);
        return res.status(OK).json(likedPosts);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting liked posts.",
            error: err.msg,
        });
    }
};

const toggleLikePost = async (req, res) => {
    try {
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting liked posts.",
            error: err.msg,
        });
    }
};

const toggleLikeComment = async (req, res) => {
    try {
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting liked posts.",
            error: err.msg,
        });
    }
};

export { getLikedPosts, toggleLikePost, toggleLikeComment };
