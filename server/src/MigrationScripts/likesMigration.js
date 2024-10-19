import { connection } from "../server.js"; // still has SQL connection in this connection variable.
import { PostLike, CommentLike } from "../schemas/MongoDB/likeSchema.js";
import { SERVER_ERROR } from "../constants/errorCodes.js";

export async function migratePostLikes(req, res, next) {
    try {
        // Fetch all comments from SQL
        const [SQLcomments] = await connection.query("SELECT * FROM post_likes");
        console.log(SQLcomments);

        if (SQLcomments.length) {
            const SQLcommentIds = SQLcomments.map((comment) => comment.comment_id);

            // Fetch all existing comments from MongoDB
            const MongoDBcomments = await PostLike.find();
            const MongoDBcommentIds = MongoDBcomments.map((c) => c.comment_id);

            const newPostLikes = [];
            const updatedPostLikes = [];

            // 1. Find new & updated records
            for (let comment of SQLcomments) {
                if (!MongoDBcommentIds.includes(comment.comment_id)) {
                    // new comment
                    newPostLikes.push(comment);
                } else {
                    // If exists, compare
                    const existingMongoPostLike = MongoDBcomments.find(
                        (c) => c.comment_id === comment.comment_id
                    );
                    if (existingMongoPostLike?.comment_content !== comment.comment_content) {
                        // If different, push to updatedPostLikes array
                        updatedPostLikes.push(comment);
                    }
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedPostLikes = await PostLike.find({
                comment_id: { $nin: SQLcommentIds },
            });

            // 3. Insert 
            if (newPostLikes.length > 0) {
                await PostLike.insertMany(newPostLikes);
            }

            // 4. Update (bulk update)
            if (updatedPostLikes.length > 0) {
                const bulkOptions = updatedPostLikes.map((c) => ({
                    updateOne: {
                        filter: { comment_id: c.comment_id },
                        update: { $set: { comment_content: c.comment_content } },
                    },
                }));
                await PostLike.bulkWrite(bulkOptions);
            }

            // 5. Delete
            if (deletedPostLikes.length > 0) {
                const deletedPostLikesIds = deletedPostLikes.map((c) => c.comment_id);
                await PostLike.deleteMany({ comment_id: { $in: deletedPostLikesIds } });
            }
            console.log(
                `${newPostLikes.length} new COMMENTS INSERTED.\n${updatedPostLikes.length} COMMENTS UPDATED.\n${deletedPostLikes.length} COMMENTS DELETED.`
            );
        } else {
            const count = await PostLike.countDocuments();
            if (count) {
                await PostLike.deleteMany();
                console.log("CLEARED MONGODB POST LIKES\n");
            } else {
                console.log("NO_POSTS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating comments",
            error: err.message,
        });
    }
}

export async function migrateCommentLikes(req, res, next) {
    try {
        // Fetch all comments from SQL
        const [SQLcomments] = await connection.query("SELECT * FROM comment_likes");
        console.log(SQLcomments);

        if (SQLcomments.length) {
            const SQLcommentIds = SQLcomments.map((comment) => comment.comment_id);

            // Fetch all existing comments from MongoDB
            const MongoDBcomments = await CommentLike.find();
            const MongoDBcommentIds = MongoDBcomments.map((c) => c.comment_id);

            const newCommentLikes = [];
            const updatedCommentLikes = [];

            // 1. Find new & updated records
            for (let comment of SQLcomments) {
                if (!MongoDBcommentIds.includes(comment.comment_id)) {
                    // new comment
                    newCommentLikes.push(comment);
                } else {
                    // If exists, compare
                    const existingMongoCommentLike = MongoDBcomments.find(
                        (c) => c.comment_id === comment.comment_id
                    );
                    if (existingMongoCommentLike?.comment_content !== comment.comment_content) {
                        // If different, push to updatedCommentLikes array
                        updatedCommentLikes.push(comment);
                    }
                }
            }

            // 2. Find deleted records (records in MongoDB but not in SQL)
            const deletedCommentLikes = await CommentLike.find({
                comment_id: { $nin: SQLcommentIds },
            });

            // 3. Insert new comments
            if (newCommentLikes.length > 0) {
                await CommentLike.insertMany(newCommentLikes);
            }

            // 4. Update existing comments (bulk update)
            if (updatedCommentLikes.length > 0) {
                const bulkOptions = updatedCommentLikes.map((c) => ({
                    updateOne: {
                        filter: { comment_id: c.comment_id },
                        update: { $set: { comment_content: c.comment_content } },
                    },
                }));
                await CommentLike.bulkWrite(bulkOptions);
            }

            // 5. Delete comments that are deleted from SQL
            if (deletedCommentLikes.length > 0) {
                const deletedCommentLikesIds = deletedCommentLikes.map((c) => c.comment_id);
                await CommentLike.deleteMany({ comment_id: { $in: deletedCommentLikesIds } });
            }
            console.log(
                `${newCommentLikes.length} new COMMENTS INSERTED.\n${updatedCommentLikes.length} COMMENTS UPDATED.\n${deletedCommentLikes.length} COMMENTS DELETED.`
            );
        } else {
            const count = await CommentLike.countDocuments();
            if (count) {
                await CommentLike.deleteMany();
                console.log("CLEARED MONGODB COMMENT LIKES\n");
            } else {
                console.log("NO_COMMENTS_TO_MIGRATE");
            }
        }

        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while migrating comments",
            error: err.message,
        });
    }
}

// export async function migratePostLikes(req, res, next) {
//     try {
//         const [postLikes] = await connection.query("SELECT * FROM post_likes");
//         console.log(postLikes);

//         if (postLikes.length) {
//             const result = await PostLike.insertMany(postLikes);
//             console.log(result);

//             if (result.length) {
//                 console.log("POST_LIKES_MIGRATED_SUCCESSFULLY");
//             } else {
//                 throw new Error({ message: "MONGODB_POST_LIKES_MIGRATION_ISSUE" });
//             }
//         } else {
//             console.log("NO_POST_LIKES_TO_MIGRATE");
//         }
//         next();
//     } catch (err) {
//         return res.status(SERVER_ERROR).json({
//             message: "something went wrong while migrating post likes",
//             error: err.message,
//         });
//     }
// }



// export async function migrateCommentLikes(req, res, next) {
//     try {
//         const [commentLikes] = await connection.query("SELECT * FROM comment_likes");
//         console.log(commentLikes);

//         if (commentLikes.length) {
//             const result = await CommentLike.insertMany(commentLikes);
//             console.log(result);

//             if (result.length) {
//                 console.log("COMMENT_LIKES_MIGRATED_SUCCESSFULLY");
//             } else {
//                 throw new Error({ message: "MONGODB_COMMENT_LIKES_MIGRATION_ISSUE" });
//             }
//         } else {
//             console.log("NO_COMMENT_LIKES_TO_MIGRATE");
//         }
//         next();
//     } catch (err) {
//         return res.status(SERVER_ERROR).json({
//             message: "something went wrong while migrating comment likes",
//             error: err.message,
//         });
//     }
// }
