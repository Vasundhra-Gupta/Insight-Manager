import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { PostLike, CommentLike } from "../schemas/MongoDB/likeSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migratePostLikes(req, res, next) {
    try {
        const [postLikes] = await connection.query("SELECT * FROM post_likes");
        console.log(postLikes);

        if (postLikes.length) {
            const result = await PostLike.insertMany(postLikes);
            console.log(result);

            if (result.length) {
                console.log("POST_LIKES_MIGRATED_SUCCESSFULLY");
            } else {
                throw new Error({ message: "MONGODB_POST_LIKES_MIGRATION_ISSUE" });
            }
        } else {
            console.log("NO_POST_LIKES_TO_MIGRATE");
        }
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating post likes",
            error: err.message,
        });
    }
}

export async function migrateCommentLikes(req, res, next) {
    try {
        const [commentLikes] = await connection.query("SELECT * FROM comment_likes");
        console.log(commentLikes);

        if (commentLikes.length) {
            const result = await CommentLike.insertMany(commentLikes);
            console.log(result);

            if (result.length) {
                console.log("COMMENT_LIKES_MIGRATED_SUCCESSFULLY");
            } else {
                throw new Error({ message: "MONGODB_COMMENT_LIKES_MIGRATION_ISSUE" });
            }
        } else {
            console.log("NO_COMMENT_LIKES_TO_MIGRATE");
        }
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating comment likes",
            error: err.message,
        });
    }
}
